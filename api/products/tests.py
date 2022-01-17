from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from products.models import Product
from PIL import Image


class ProductTests(APITestCase):

    @staticmethod
    def create_image():
        bts = BytesIO()
        img = Image.new("RGB", (100, 100))
        img.save(bts, 'jpeg')
        return bts.getvalue()

    def test_list_products(self):
        """
        Ensure we can list products.
        """
        Product.objects.bulk_create([
            Product(name="Test name 1", description="Test description 1", price=21.2,
                    image=SimpleUploadedFile("test.jpg", self.create_image())),
            Product(name="Test name 2", description="Test description 2", price=20.0,
                    image=SimpleUploadedFile("test.jpg", self.create_image())),
            Product(name="Test name 3", description="Test description 3", price=19.0,
                    image=SimpleUploadedFile("test.jpg", self.create_image()))
        ])
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(len(response.json()), 3)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_product(self):
        """
        Ensure we can create a new product.
        """
        url = reverse('product-list')
        data = {'name': 'test name', 'description': 'test description', 'price': 24,
                'image': SimpleUploadedFile("test.jpg", self.create_image())}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 1)
        self.assertEqual(Product.objects.get().name, 'test name')
        self.assertEqual(Product.objects.get().description, 'test description')
        self.assertEqual(Product.objects.get().price, 24)

    def test_update_product(self):
        """
        Ensure we can update a product.
        """

        p = Product.objects.create(
            name="Test name",
            description="Test description",
            price=21.2,
            image=SimpleUploadedFile("test.jpg", self.create_image())
        )

        url = reverse('product-detail', kwargs={'pk': p.id})
        data = {'name': 'test name 2', 'description': 'test description 2', 'price': 24,
                'image': SimpleUploadedFile("test.jpg", self.create_image())}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Product.objects.count(), 1)
        self.assertEqual(Product.objects.get().id, p.id)
        self.assertEqual(Product.objects.get().name, 'test name 2')
        self.assertEqual(Product.objects.get().description, 'test description 2')
        self.assertEqual(Product.objects.get().price, 24)

    def test_delete_product(self):
        """
        Ensure we can delete a product.
        """
        p = Product.objects.create(
            name="Test name",
            description="Test description",
            price=21.2,
            image=SimpleUploadedFile("test.jpg", self.create_image())
        )

        url = reverse('product-detail', kwargs={'pk': p.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)
