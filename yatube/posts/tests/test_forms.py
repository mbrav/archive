from .test_factory import TestModelFactory
from django.urls import reverse

from posts.models import Post


class PostsFormTests(TestModelFactory):
    """Test Forms"""

    def test_create_post(self):
        """Валидная форма создает запись в Post."""
        post_count = Post.objects.count()
        form_data = {
            'text': 'Тестовый текст',
            'group': self.group.id,
        }
        response = self.authorized_client.post(
            reverse('post_create'),
            data=form_data,
            follow=True,
        )
        # Проверяем, сработал ли редирект
        self.assertRedirects(response, reverse('profile', kwargs={
            'username': self.auth_user.username}))
        # Проверяем, увеличилось ли число постов
        self.assertEqual(Post.objects.count(), post_count + 1)
        # Проверяем, что создалась запись с заданным текстом
        self.assertTrue(
            Post.objects.filter(
                text='Тестовый текст',
            ).exists())

    def test_edit_post(self):
        """Валидная форма редактирует запись в Post."""
        post_count = Post.objects.count()

        new_text = self.post.text + 'Тестовая редакция'
        form_data = {
            'text': new_text,
            'group': self.group.id,
        }
        response = self.authorized_client.post(
            reverse('post_edit', kwargs={
                'post_id': self.post.id}),
            data=form_data,
            follow=True,
        )
        # Проверяем, сработал ли редирект
        self.assertRedirects(response, reverse('post', kwargs={
            'post_id': self.post.id}))
        # Убедимся, что запись в базе данных не создалась:
        # сравним количество записей в Task до и после отправки формы
        self.assertEqual(Post.objects.count(), post_count)
        # Проверяем, что отредактировалась запись с заданным текстом
        self.assertTrue(
            Post.objects.filter(
                text=new_text,
            ).exists()
        )
