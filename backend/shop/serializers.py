# filepath: c:\Users\Tomek\source\loopstore\backend\shop\serializers.py
from rest_framework import serializers
from .models import Product, Order, Category, ProductSize, OrderStatus

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent']

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    sizes = ProductSizeSerializer(many=True, read_only=True)
    size_ids = serializers.PrimaryKeyRelatedField(
        queryset=ProductSize.objects.all(),
        source='sizes',
        write_only=True,
        many=True,
        required=False
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'price', 
            'stock', 'image', 'category', 'category_id', 'sizes', 
            'size_ids', 'status', 'tags', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = ['id', 'status', 'notes', 'created_at']
        read_only_fields = ['created_at']

class OrderSerializer(serializers.ModelSerializer):
    status_history = OrderStatusSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email',
            'address', 'items', 'status', 'payment_status',
            'payment_method', 'total_amount', 'created_at',
            'updated_at', 'status_history'
        ]
        read_only_fields = ['order_number', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Ensure items is a list
        if 'items' not in validated_data:
            validated_data['items'] = []
        return super().create(validated_data)
