from django.db import models
from apps.core.models import BaseModel

class Author(models.Model):
    name = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='authors/')
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Blog(BaseModel):
    source_id = models.CharField(max_length=100, blank=True, default='')
    display_order = models.PositiveIntegerField(default=0)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=255, unique=True)
    content = models.TextField()
    excerpt = models.TextField(blank=True, default='')
    category = models.CharField(max_length=150, blank=True, default='')
    main_image = models.ImageField(upload_to='blogs/')
    main_image_credit = models.CharField(max_length=255, blank=True, default='')
    main_image_source_url = models.URLField(blank=True, default='')
    gallery = models.JSONField(
        default=list,
        blank=True,
        help_text=(
            'List of image objects: '
            "[{'url': '/path/image.jpg', 'credit': 'Photographer', "
            "'source_url': 'https://example.com/source'}]"
        ),
    )
    published_at = models.DateTimeField(blank=True, null=True)
    published_label = models.CharField(max_length=100, blank=True, default='')
    read_time = models.CharField(max_length=100, blank=True, default='')
    featured = models.BooleanField(default=False)
    tags = models.JSONField(default=list, blank=True, help_text="List of tags: ['Adventure', 'Brazil', 'Rio']")
    
    # SEO overrides
    seo_title = models.CharField(max_length=150, blank=True, null=True)
    seo_description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['display_order', '-published_at', '-created_at']

    def __str__(self):
        return self.title

class FAQ(BaseModel):
    CATEGORY_CHOICES = (
        ('general', 'General Info'),
        ('booking', 'Booking & Cancellations'),
        ('payment', 'Pricing & Payments'),
        ('tours', 'Tours & Activities'),
    )
    
    source_id = models.CharField(max_length=100, blank=True, default='')
    source_category = models.CharField(max_length=100, blank=True, default='')
    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'question']

    def __str__(self):
        return self.question

class Banner(BaseModel):
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=250, blank=True, null=True)
    image = models.ImageField(upload_to='banners/')
    link = models.CharField(max_length=255, blank=True, null=True)
    active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title

class Partner(BaseModel):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='partners/')
    website = models.URLField(blank=True, null=True)
    active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class Settings(BaseModel):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Settings"

    def __str__(self):
        return self.key

class Page(BaseModel):
    source_id = models.CharField(max_length=100, blank=True, default='')
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=255, unique=True)
    content = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Office(BaseModel):
    city = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    address = models.TextField(blank=True, default='')
    phone = models.CharField(max_length=100, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    whatsapp = models.CharField(max_length=100, blank=True, default='')
    hours = models.CharField(max_length=255, blank=True, default='')
    is_headquarters = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'city']

    def __str__(self):
        return f'{self.city}, {self.country}'


class TeamMember(BaseModel):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='team/', blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Testimonial(BaseModel):
    source_id = models.CharField(max_length=100, blank=True, default='')
    author = models.CharField(max_length=150)
    country = models.CharField(max_length=100, blank=True, default='')
    rating = models.PositiveSmallIntegerField(default=5)
    date_label = models.CharField(max_length=100, blank=True, default='')
    title = models.CharField(max_length=200, blank=True, default='')
    comment = models.TextField()
    tour_name = models.CharField(max_length=200, blank=True, default='')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f'{self.author}: {self.title}'


class SiteProfile(BaseModel):
    siteurl = models.URLField(blank=True, default='')
    blogname = models.CharField(max_length=200)
    blogdescription = models.TextField(blank=True, default='')
    user_count = models.PositiveIntegerField(default=0)
    post_count = models.PositiveIntegerField(default=0)
    tour_count = models.PositiveIntegerField(default=0)
    blog_count = models.PositiveIntegerField(default=0)
    page_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Site profile'
        verbose_name_plural = 'Site profile'

    def __str__(self):
        return self.blogname

class Menu(BaseModel):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=255, help_text="e.g. /destinations or /tours")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return f"{self.title} (-> {self.url})"
