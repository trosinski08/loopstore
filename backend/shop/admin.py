from django.contrib import admin
from .models import TestModel, Product, Order, Category, ProductSize

admin.site.register(TestModel)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Category)
admin.site.register(ProductSize)