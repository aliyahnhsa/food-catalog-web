from django.db import models

class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('main_course', 'Main Course'),
        ('snack', 'Snack'),
        ('dessert', 'Dessert'),
        ('drink', 'Drink'),
    ]

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    prep_time_minutes = models.PositiveIntegerField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    is_halal = models.BooleanField(default=True)
    is_spicy = models.BooleanField(default=False)
    available_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='menus/images/', null=True, blank=True)
    video = models.FileField(upload_to='menus/videos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name