from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase # type: ignore
from rest_framework import status # type: ignore
from shop.models import Product, Order
from decimal import Decimal
from django.contrib.auth.models import User

class ProductViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=Decimal('99.99'),
            stock=10,
        )
        self.url = reverse('product-list')

    def test_get_product_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_product(self):
        data = {
            'name': 'New Product',
            'description': 'New Description',
            'price': '149.99',
            'stock': 5,
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)

class OrderViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=Decimal('99.99'),
            stock=10,
        )
        self.url = reverse('orders')

    def test_create_order(self):
        data = {
            'name': 'Test Customer',
            'email': 'test@example.com',
            'address': 'Test Address',
            'items': [{'id': self.product.id, 'quantity': 2}]
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)

    def test_create_order_invalid_data(self):
        data = {
            'name': 'Test Customer',
            'email': 'invalid-email',  # Invalid email
            'address': 'Test Address',
            'items': []  # Empty items
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 