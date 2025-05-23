"""
URL configuration for backend_web project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# backend_web/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from shop.views import (
    ProductViewSet, 
    CategoryViewSet,
    ProductSizeViewSet,
    OrderViewSet,
    home,
    health_check
)
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from two_factor.views import LoginView
from two_factor.urls import urlpatterns as tf_urls

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'sizes', ProductSizeViewSet, basename='size')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/healthcheck/', health_check, name='health_check'),
    path('', home, name='home'),
    
    # Authentication URLs
    path('accounts/login/', LoginView.as_view(), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('accounts/password_change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('accounts/password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('accounts/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('accounts/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('accounts/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('accounts/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
      # Two-factor authentication URLs
    path('', include(tf_urls)),
    
    # Security monitoring URLs
    path('defender/', include('defender.urls')),
    # path('axes/', include('axes.urls')),  # axes nie dostarcza modułu urls
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)