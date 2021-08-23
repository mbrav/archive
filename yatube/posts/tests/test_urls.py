from .test_factory import TestModelFactory
from django.test import Client


class PostURLTests(TestModelFactory):

    # Проверяем общедоступные страницы
    def test_home_url_exists_at_desired_location(self):
        """Страница / доступна любому пользователю."""
        response = self.guest_client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_profile_added_url_exists_at_desired_location(self):
        """Страница /profile/username доступна любому пользователю."""
        response = self.guest_client.get(
            f'/profile/{self.auth_user.username}/')
        self.assertEqual(response.status_code, 200)

    def test_group_url_exists_at_desired_location(self):
        """Страница /group/group_slug доступна любому пользователю."""
        response = self.guest_client.get(f'/group/{self.group.slug}/')
        self.assertEqual(response.status_code, 200)

    def test_post_url_exists_at_desired_location(self):
        """Страница /post/post_id/ доступна любому пользователю."""
        response = self.guest_client.get(f'/posts/{self.post.id}/')
        self.assertEqual(response.status_code, 200)

    # Проверяем доступность страниц для авторизованного пользователя
    def test_create_post_url_exists_at_desired_location(self):
        """Страница /create/ доступна авторизованному пользователю."""
        response = self.authorized_client.get('/create/')
        self.assertEqual(response.status_code, 200)

    def test_edit_post_url_exists_at_desired_location(self):
        """Страница /posts/post_id/edit доступна
        авторизованному пользователю."""
        response = self.authorized_client.get(f'/posts/{self.post.id}/edit/')
        self.assertEqual(response.status_code, 200)

    # Проверка вызываемых шаблонов для каждого адреса
    def test_urls_uses_correct_template(self):
        """URL-адрес использует соответствующий шаблон."""
        templates_url_names = {
            'posts/index.html': '/',
            'posts/profile.html': f'/profile/{self.auth_user.username}/',
            'posts/group_list.html': f'/group/{self.group.slug}/',
            'posts/post_detail.html': f'/posts/{self.post.id}/',
            # 'posts/create_post.html': '/create',
            # 'posts/update_post.html': f'/posts/{self.post.id}/edit',
        }
        for template, url in templates_url_names.items():
            with self.subTest(url=url):
                response = self.guest_client.get(url)
                self.assertTemplateUsed(response, template)
