# posts/tests/tests_url.py
from django.test import TestCase, Client


class StaticURLTests(TestCase):

    def setUp(self):
        super().setUpClass()
        self.guest_client = Client()

    def test_homepage(self):
        response = self.guest_client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_post_create(self):
        response = self.guest_client.get('/create/')
        self.assertTemplateUsed(response, 'posts/create_post.html')
