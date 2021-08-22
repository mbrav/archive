from django.contrib.auth import get_user_model
from django.test import TestCase

from posts.models import Post, Group

User = get_user_model()


class TestModelFactory(TestCase):
    """Общий класс для создания моделей"""
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User.objects.create_user(username='auth')
        cls.group = Group.objects.create(
            title='Тестовая группа',
            slug='test-slug',
            description='Тестовое описание',
        )
        cls.post = Post.objects.create(
            author=cls.user,
            text='Тестовая группа',
        )


class PostModelTest(TestModelFactory):
    """Тест Постов"""

    def test_verbose_name(self):
        """verbose_name в полях совпадает с ожидаемым."""
        post = PostModelTest.post
        field_verboses = {
            'text': 'Текст',
            'pub_date': 'Дата публикации поста',
            'author': 'Автор поста',
            'group': 'Группа поста',
        }
        for field, expected_value in field_verboses.items():
            with self.subTest(field=field):
                self.assertEqual(
                    post._meta.get_field(field).verbose_name, expected_value)

    def test_help_text(self):
        """help_text в полях совпадает с ожидаемым."""
        post = PostModelTest.post
        field_help_texts = {
            'text': 'Напишите текст поста',
            'pub_date': 'Укажите дату публикации поста',
            'author': 'Укажите автора поста',
            'group': 'Укажите группу поста',
        }
        for field, expected_value in field_help_texts.items():
            with self.subTest(field=field):
                self.assertEqual(
                    post._meta.get_field(field).help_text, expected_value)

    def test_str_text(self):
        post = PostModelTest.post
        self.assertEqual(str(post), post.text[:15])


class GroupModelTest(TestModelFactory):
    """Тест Групп"""

    def test_str_text(self):
        group = GroupModelTest.group
        self.assertEqual(str(group), group.title)
