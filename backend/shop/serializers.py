# filepath: c:\Users\Tomek\source\loopstore\backend\shop\serializers.py
from rest_framework import serializers
from .models import Product, Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
		model = Order
		fields = '__all__'
