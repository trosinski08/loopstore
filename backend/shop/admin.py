from django.contrib import admin
from .models import Product, Order

admin.site.register(Product)
# admin.site.register(Order)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'email', 'address', 'created_at')
	search_fields = ('name', 'email', 'address')
	list_filter = ('created_at',)
	ordering = ('-created_at',)