import random
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

        self.number_of_posts = random.randint(30, 100)
        posts = []
        for p in range(0, self.number_of_posts):
            new_p = Post(
                text=f'Тестовой пост №{p}',
                author=self.auth_user,
                group=self.group,
                id=p
            )
            posts.append(new_p)

        Post.objects.bulk_create(objs=posts, batch_size=100)
        self.post = Post.objects.all().last()
