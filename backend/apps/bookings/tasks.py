import os
from celery import shared_task
from django.conf import settings
from django.core.files.base import ContentFile
from apps.bookings.models import Booking, Invoice
from apps.users.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# ReportLab Imports
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from io import BytesIO

@shared_task
def generate_invoice_pdf(booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return f"Booking {booking_id} not found."

    # Setup file buffers
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    story = []

    # Design Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'InvoiceTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#1B5E20') # Amazon Green
    )
    body_style = ParagraphStyle(
        'InvoiceBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#263238') # Dark Gray
    )
    header_style = ParagraphStyle(
        'InvoiceHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.white
    )

    # Document Header
    story.append(Paragraph("GIRASOL LUXURY TOURS", title_style))
    story.append(Paragraph("Premium Travel Experiences - Brazil & South America", body_style))
    story.append(Spacer(1, 20))

    # Invoice Info Grid
    invoice_number = f"INV-{booking.booking_reference[:8].upper()}"
    info_data = [
        [Paragraph(f"<b>Invoice No:</b> {invoice_number}", body_style), 
         Paragraph(f"<b>Date:</b> {booking.created_at.strftime('%Y-%m-%d') if booking.created_at else 'Today'}", body_style)],
        [Paragraph(f"<b>Booking Reference:</b> {booking.booking_reference}", body_style), 
         Paragraph(f"<b>Status:</b> {booking.get_status_display()}", body_style)],
        [Paragraph(f"<b>Customer Email:</b> {booking.user.email if booking.user else 'Guest Checkout'}", body_style), ""]
    ]
    info_table = Table(info_data, colWidths=[300, 200])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 20))

    # Invoice Line Items Table Headers
    table_data = [[
        Paragraph("Item Detail / Description", header_style),
        Paragraph("Start Date", header_style),
        Paragraph("Qty", header_style),
        Paragraph("Price", header_style),
        Paragraph("Total", header_style)
    ]]

    # Fill Line Items
    for item in booking.items.all():
        detail_text = ""
        if item.item_type == 'tour_package' and item.tour_package:
            detail_text = f"Tour Package: {item.tour_package.tour.name} - {item.tour_package.title}"
        elif item.item_type == 'room' and item.room:
            detail_text = f"Hotel Stay: {item.room.hotel.name} - {item.room.name}"
        elif item.item_type == 'vehicle' and item.vehicle:
            detail_text = f"Vehicle Rental: {item.vehicle.name} ({item.vehicle.get_type_display()})"
        
        table_data.append([
            Paragraph(detail_text or "Travel Service", body_style),
            Paragraph(item.start_date.strftime('%Y-%m-%d'), body_style),
            Paragraph(str(item.quantity), body_style),
            Paragraph(f"${item.unit_price}", body_style),
            Paragraph(f"${item.total_price}", body_style)
        ])

    # Summary Lines
    table_data.append(["", "", "", Paragraph("<b>Subtotal</b>", body_style), Paragraph(f"${booking.total_price}", body_style)])
    table_data.append(["", "", "", Paragraph("<b>Taxes</b>", body_style), Paragraph(f"${booking.tax_amount}", body_style)])
    table_data.append(["", "", "", Paragraph("<b>Discount</b>", body_style), Paragraph(f"-${booking.discount_amount}", body_style)])
    table_data.append(["", "", "", Paragraph("<b>Grand Total</b>", body_style), Paragraph(f"<b>${booking.grand_total}</b>", body_style)])

    # Itemized Table Styling
    item_table = Table(table_data, colWidths=[200, 90, 40, 80, 90])
    item_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#2E7D32')), # Forest Green header
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1, -5), 0.5, colors.HexColor('#B0BEC5')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LINEABOVE', (3,-4), (4,-4), 1, colors.HexColor('#263238')),
        ('LINEBELOW', (3,-1), (4,-1), 2, colors.HexColor('#263238')),
    ]))
    story.append(item_table)
    story.append(Spacer(1, 30))

    # Terms & Footer
    story.append(Paragraph("<b>Thank you for choosing Girasol Luxury Tours!</b>", body_style))
    story.append(Paragraph("Please retain this receipt for your records. Standard booking terms and cancellation policies apply.", body_style))

    # Compile Doc
    doc.build(story)
    
    # Save the Buffer back into Django Invoice model
    pdf_content = buffer.getvalue()
    buffer.close()

    invoice, created = Invoice.objects.get_or_create(
        booking=booking,
        defaults={'invoice_number': invoice_number}
    )
    
    filename = f"invoice_{booking.booking_reference}.pdf"
    invoice.pdf_file.save(filename, ContentFile(pdf_content))
    invoice.save()

    # Trigger user notifications
    trigger_notification.delay(
        user_id=str(booking.user.id) if booking.user else None,
        title="Booking Invoice Ready",
        message=f"Your booking reference {booking.booking_reference[:8].upper()} invoice is ready for download."
    )

    return f"Generated Invoice PDF successfully for Booking ID: {booking_id}"

@shared_task
def trigger_notification(user_id, title, message):
    if not user_id:
        return "No user registered to receive notification"
    
    # Save database notification entry
    try:
        notification = Notification.objects.create(
            user_id=user_id,
            title=title,
            message=message
        )
    except Exception as e:
        return f"Failed to save notification: {str(e)}"

    # Stream real-time notification to client WebSockets via Channels
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}",
            {
                "type": "send_notification",
                "notification_id": notification.id,
                "title": title,
                "message": message,
            }
        )
        return f"Dispatched WebSocket notification to user_{user_id}"
    
    return "WebSocket notification layer not available"
