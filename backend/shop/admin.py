from django.contrib import admin
from .models import TestModel, Product, Order

admin.site.register(TestModel)
admin.site.register(Product)
admin.site.register(Order)