from django.urls import path
from . import views

urlpatterns = [
    path('api/login/', views.user_login, name='clients'),
    path('api/logout/', views.user_logout, name='logout'),
    path('api/register/', views.register, name='register'),
    path('api/transactions/', views.transactions, name='transactions'),
    path('api/transactions/<int:transaction_id>/', views.transaction_detail, name='transaction_detail'),
    path('api/forgot-password/', views.forgot_password),
    path('api/verify-pin/', views.verify_pin),
    path('api/change-password/', views.change_password)
]
