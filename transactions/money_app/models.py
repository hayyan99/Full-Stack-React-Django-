from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta
import random, string

class UserProfile(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    phone = models.CharField(max_length=20)
    password = models.CharField(max_length=128)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - ${self.amount}"
    
    class Meta:
        ordering = ['-date']

class PasswordResetPin(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    email = models.EmailField()
    pin = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pin:
            self.pin = ''.join(random.choices(string.digits, k=6))
        
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=1)
        
        super().save(*args, **kwargs)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['id']

class ContactInfo(models.Model):
    contact_type = models.CharField(max_length=50)
    label = models.CharField(max_length=50)
    value = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['contact_type']


