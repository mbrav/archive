from django.contrib.auth import get_user_model
from django.test import TestCase, Client

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

class PostURLTests(TestModelFactory):
    def setUp(self):
        # Создаем неавторизованный клиент
        self.guest_client = Client()
        # Создаем авторизованый клиент
        self.user = User.objects.create_user(username='StasBasov')
        self.authorized_client = Client()
        self.authorized_client.force_login(self.user)

    # Проверяем общедоступные страницы
    def test_home_url_exists_at_desired_location(self):
        """Страница / доступна любому пользователю."""
        response = self.guest_client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_profile_added_url_exists_at_desired_location(self):
        """Страница /profile/ доступна любому пользователю."""
        response = self.guest_client.get(f'/profile/{self.user.username}/')
        self.assertEqual(response.status_code, 200)

    def test_group_url_exists_at_desired_location(self):
        """Страница /group/ доступна любому пользователю."""
        response = self.guest_client.get(f'/group/{self.group.slug}/')
        self.assertEqual(response.status_code, 200)

    def test_post_url_exists_at_desired_location(self):
        """Страница /post/ доступна любому пользователю."""
        response = self.guest_client.get(f'/posts/{self.post.id}/')
        self.assertEqual(response.status_code, 200)

    # Проверяем доступность страниц для авторизованного пользователя
    def test_create_post_url_exists_at_desired_location(self):
        """Страница /task/ доступна авторизованному пользователю."""
        response = self.authorized_client.get('/create/')
        self.assertEqual(response.status_code, 200)

    def test_edit_post_url_exists_at_desired_location(self):
        """Страница /posts/post_id/edit доступна авторизованному пользователю."""
        response = self.authorized_client.get(f'/posts/{self.post.id}/edit/')
        self.assertEqual(response.status_code, 200)

    # Проверка вызываемых шаблонов для каждого адреса
    def test_urls_uses_correct_template(self):
        """URL-адрес использует соответствующий шаблон."""
        templates_url_names = {
            # Не работает из-за select_related('group')
            #   Ln9  yatube/posts/forms.py
            # и {% url "group_list" group_slug=post.group.slug %} 
            #   Ln18 yatube/templates/posts/index.html
            'posts/index.html': '/',
            'posts/profile.html': f'/profile/{self.user.username}/',
            'posts/group_list.html': f'/group/{self.group.slug}/',
            'posts/post_detail.html': f'/posts/{self.post.id}/',
            'posts/create_post.html': '/create/',
            'posts/update_post.html': f'/posts/{self.post.id}/edit/',
        }
        for template, url in templates_url_names.items():
            with self.subTest(url=url):
                response = self.authorized_client.get(url)
                self.assertTemplateUsed(response, template)
