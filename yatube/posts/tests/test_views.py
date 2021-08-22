# deals/tests/test_views.py
from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse

from django.db import models
from posts.models import Post, Group

User = get_user_model()


class TestModelFactory(TestCase):
    """Общий класс для создания моделей"""
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User.objects.create_user(username='test_username')
        cls.group = Group.objects.create(
            title='Тестовая группа',
            slug='test_group_slug',
            description='Тестовое описание',
        )
        cls.post = Post.objects.create(
            author=cls.user,
            text='Тестовая группа',
            id='123',
        )


class PostsViewsTests(TestModelFactory):

    def setUp(self):
        # Создаем авторизованный клиент
        self.user = User.objects.create_user(username='StasBasov')
        self.authorized_client = Client()
        self.authorized_client.force_login(self.user)

    # Проверяем используемые шаблоны
    def test_pages_uses_correct_template(self):
        """URL-адрес использует соответствующий шаблон."""
        # Собираем в словарь пары "имя_html_шаблона: reverse(name)"
        templates_pages_names = {
            'posts/index.html': reverse('index'),
            'posts/profile.html': (
                reverse('profile', kwargs={'username': self.user.username})
            ),
            'posts/group_list.html': (
                reverse('group_list', kwargs={'group_slug': self.group.slug})
            ),
            'posts/post_detail.html': (
                reverse('post', kwargs={'post_id': self.post.id})
            ),
            'posts/create_post.html': reverse('post_create'),
            'posts/update_post.html': (
                reverse('post_edit', kwargs={'post_id': self.post.id})
            ),
        }
        # Проверяем, что при обращении к name вызывается соответствующий HTML-шаблон
        for template, reverse_name in templates_pages_names.items():
            with self.subTest(reverse_name=reverse_name):
                response = self.authorized_client.get(reverse_name)
                self.assertTemplateUsed(response, template)
