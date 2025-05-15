from django.test import TestCase
from shop.models import Product, Order
from decimal import Decimal

class ProductModelTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=Decimal('99.99'),
            stock=10,
        )

    def test_product_creation(self):
        self.assertTrue(isinstance(self.product, Product))
        self.assertEqual(self.product.__str__(), 'Test Product')

    def test_product_fields(self):
        self.assertEqual(self.product.name, 'Test Product')
        self.assertEqual(self.product.description, 'Test Description')
        self.assertEqual(self.product.price, Decimal('99.99'))
        self.assertEqual(self.product.stock, 10)

class OrderModelTest(TestCase):
    def setUp(self):
        self.order = Order.objects.create(
            name='Test Customer',
            email='test@example.com',
            address='Test Address',
            items=[{'id': 1, 'quantity': 2}]
        )

    def test_order_creation(self):
        self.assertTrue(isinstance(self.order, Order))
        self.assertEqual(self.order.__str__(), f"Order {self.order.id} - Test Customer")

    def test_order_fields(self):
        self.assertEqual(self.order.name, 'Test Customer')
        self.assertEqual(self.order.email, 'test@example.com')
        self.assertEqual(self.order.address, 'Test Address')
        self.assertEqual(self.order.items, [{'id': 1, 'quantity': 2}]) 