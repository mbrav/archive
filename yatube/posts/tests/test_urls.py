from django.urls import reverse

from .test_factory import TestModelFactory


class PostURLTests(TestModelFactory):
    """Тест URL"""

    # Проверяем общедоступные страницы
    def test_home_url_exists(self):
        """Страница / доступна любому пользователю."""
        response = self.guest_client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

    def test_profile_added_url_exists(self):
        """Страница /profile/username доступна любому пользователю."""
        response = self.guest_client.get(reverse('profile', kwargs={
            'username': self.auth_user.username}))
        self.assertEqual(response.status_code, 200)

    def test_group_url_exists(self):
        """Страница /group/group_slug доступна любому пользователю."""
        response = self.guest_client.get(reverse('group_list', kwargs={
            'group_slug': self.group.slug}))
        self.assertEqual(response.status_code, 200)

    def test_post_url_exists(self):
        """Страница /post/post_id/ доступна любому пользователю."""
        response = self.guest_client.get(reverse('post', kwargs={
            'post_id': self.post.id}))
        self.assertEqual(response.status_code, 200)

    # Проверяем доступность страниц для авторизованного пользователя
    def test_create_post_url_exists(self):
        """Страница /create/ доступна авторизованному пользователю."""
        response = self.authorized_client.get(reverse('post_create'))
        self.assertEqual(response.status_code, 200)

    def test_edit_post_url_exists(self):
        """Страница /posts/post_id/edit доступна
        авторизованному пользователю."""
        response = self.authorized_client.get(reverse('post_edit', kwargs={
            'post_id': self.post.id}))
        self.assertEqual(response.status_code, 200)

    # Проверка вызываемых шаблонов для каждого адреса
    def test_pages_uses_correct_template(self):
        """URL-адрес использует соответствующий шаблон."""
        templates_pages_names = {
            'posts/index.html': reverse('index'),
            'posts/profile.html': (
                reverse('profile', kwargs={
                        'username': self.auth_user.username})
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
        for template, reverse_name in templates_pages_names.items():
            with self.subTest(reverse_name=reverse_name):
                response = self.authorized_client.get(reverse_name)
                self.assertTemplateUsed(response, template)
