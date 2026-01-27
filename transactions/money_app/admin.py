from django.contrib import admin
from .models import UserProfile, Transaction, PasswordResetPin, FAQ, ContactInfo

# Register all models
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'phone')
    search_fields = ('username', 'email')
    readonly_fields = ('password',)
