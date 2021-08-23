from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from posts.models import Post, Group

User = get_user_model()


class TestModelFactory(TestCase):
    """Обобществлённый завод для создания моделей"""
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.auth_user = User.objects.create_user(username='test_username')
        self.authorized_client = Client()
        self.guest_client = Client()
        self.authorized_client.force_login(self.auth_user)
        self.group = Group.objects.create(
            title='Тестовая группа',
            slug='test_group_slug',
            description='Тестовое описание',
        )

        for i in range(1, 40):
            self.number_of_posts = i
            Post.objects.create(
                text=f'Тестовой пост №{self.number_of_posts}',
                author=self.auth_user,
                group=self.group,
                id=self.number_of_posts
            )

        self.post = Post.objects.all().last()
