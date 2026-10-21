from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0004_alter_blog_slug_alter_page_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='gallery',
            field=models.JSONField(
                blank=True,
                default=list,
                help_text=(
                    'List of image objects: '
                    "[{'url': '/path/image.jpg', 'credit': 'Photographer', "
                    "'source_url': 'https://example.com/source'}]"
                ),
            ),
        ),
        migrations.AddField(
            model_name='blog',
            name='main_image_credit',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='blog',
            name='main_image_source_url',
            field=models.URLField(blank=True, default=''),
        ),
    ]
