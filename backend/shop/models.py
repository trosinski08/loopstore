from django.db import models
from django.utils.text import slugify
from django.utils import timezone

class TestModel(models.Model):
    name = models.CharField(max_length=100)

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "categories"

class ProductSize(models.Model):
    name = models.CharField(max_length=50)  # S, M, L, XL, etc.
    
    def __str__(self):
        return self.name

class Product(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('out_of_stock', 'Out of Stock'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    sku = models.CharField(max_length=100, unique=True, null=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image = models.ImageField(upload_to='products/')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    sizes = models.ManyToManyField(ProductSize, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.sku:
            # Generate SKU: CAT-PRODUCTID-TIMESTAMP
            from datetime import datetime
            timestamp = datetime.now().strftime('%y%m%d')
            self.sku = f"{self.category.name[:3].upper() if self.category else 'UNK'}-{self.id or '0'}-{timestamp}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class OrderStatus(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.order.order_number} - {self.status}"

    class Meta:
        verbose_name_plural = "order statuses"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
    ]

    order_number = models.CharField(max_length=50, unique=True, blank=True)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    address = models.TextField()
    items = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='card')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate order number: ORD-YYYYMMDD-XXXX
            last_order = Order.objects.order_by('-id').first()
            if last_order and last_order.order_number:
                last_number = int(last_order.order_number.split('-')[-1])
                new_number = str(last_number + 1).zfill(4)
            else:
                new_number = '0001'
            from datetime import datetime
            self.order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{new_number}"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} - {self.customer_name}"