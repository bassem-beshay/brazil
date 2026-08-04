from django.db import models
from apps.core.models import BaseModel

class Author(models.Model):
    name = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='authors/')
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Blog(BaseModel):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    main_image = models.ImageField(upload_to='blogs/')
    published_at = models.DateTimeField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, help_text="List of tags: ['Adventure', 'Brazil', 'Rio']")
    
    # SEO overrides
    seo_title = models.CharField(max_length=150, blank=True, null=True)
    seo_description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

class FAQ(BaseModel):
    CATEGORY_CHOICES = (
        ('general', 'General Info'),
        ('booking', 'Booking & Cancellations'),
        ('payment', 'Pricing & Payments'),
        ('tours', 'Tours & Activities'),
    )
    
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
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Menu(BaseModel):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=255, help_text="e.g. /destinations or /tours")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return f"{self.title} (-> {self.url})"
