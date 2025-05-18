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
    home
)
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'sizes', ProductSizeViewSet, basename='size')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', home, name='home'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)