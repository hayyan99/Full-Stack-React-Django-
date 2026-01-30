from django.contrib import admin
from .models import UserProfile, Transaction, FAQ, ContactInfo

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'phone')
    search_fields = ('username', 'email')
    exclude = ('password',)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'amount', 'transaction_type', 'category', 'date')
    search_fields = ('title', 'category', 'user__username')
    list_filter = ('transaction_type', 'category', 'date')

    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj = None):
        return False
    
    def has_change_permission(self, request, obj = None):
        return False

@admin.register(FAQ)
class FAQsAdmin(admin.ModelAdmin):
    list_display = ('question', 'answer', 'is_active', 'created_at')
    search_fields = ('question',)

    
@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('contact_type', 'value')
    search_fields = ('contact_type', 'value')
    
    def save_model(self, request, obj, form, change):
        obj.full_clean()  
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return False
    
    

