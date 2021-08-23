from django import forms
from django.urls import reverse

from .test_factory import TestModelFactory


class PostsViewsTests(TestModelFactory):
    """"Тест View"""

    # Проверяем, что словарь context страницы post/test-
    # содержит ожидаемые значения
    def test_task_detail_pages_show_correct_context(self):
        """Шаблон post_detail сформирован с правильным контекстом."""
        response = self.authorized_client.get(
            reverse('post', kwargs={'post_id': self.post.id})
        )
        self.assertEqual(response.context.get('post').author, self.auth_user)
        self.assertEqual(response.context.get('post').text, self.post.text)
        self.assertEqual(response.context.get('post').group, self.group)
        self.assertEqual(response.context.get('post').id, self.post.id)

    def test_post_create_show_correct_context(self):
        """Шаблон post_create сформирован с правильным контекстом."""
        response = self.authorized_client.get(reverse('post_create'))
        form_fields = {
            'text': forms.fields.CharField,
            'group': forms.fields.ChoiceField,
        }
        for value, expected in form_fields.items():
            with self.subTest(value=value):
                form_field = response.context.get('form').fields.get(value)
                self.assertIsInstance(form_field, expected)

    def test_post_edit_show_correct_context(self):
        """Шаблон post_edit сформирован с правильным контекстом."""
        response = self.authorized_client.get(
            reverse('post_edit', kwargs={'post_id': self.post.id})
        )
        form_fields = {
            'text': forms.fields.CharField,
            'group': forms.fields.ChoiceField,
        }
        for value, expected in form_fields.items():
            with self.subTest(value=value):
                form_field = response.context.get('form').fields.get(value)
                self.assertIsInstance(form_field, expected)


class GroupsViewsTests(TestModelFactory):
    """Проверяем, что словарь context страницы /index
    в первом элементе списка page_obj содержит ожидаемые значения"""

    def test_index_page_show_correct_context(self):
        """Шаблон index сформирован с правильным контекстом."""
        response = self.authorized_client.get(reverse('index'))
        first_object = response.context['page_obj'].object_list[0]
        self.assertEqual(first_object.id, self.post.id)
        self.assertEqual(first_object.text, self.post.text)
        self.assertEqual(first_object.author, self.auth_user)

    def test_group_list_page_show_correct_context(self):
        """Шаблон group_list сформирован с правильным контекстом."""
        response = self.authorized_client.get(
            reverse('group_list', kwargs={'group_slug': self.group.slug})
        )
        first_object = response.context['page_obj'].object_list[0]
        self.assertEqual(first_object.id, self.post.id)
        self.assertEqual(first_object.text, self.post.text)
        self.assertEqual(first_object.author, self.auth_user)

    def test_profile_page_show_correct_context(self):
        """Шаблон profile сформирован с правильным контекстом."""
        response = self.authorized_client.get(
            reverse('profile', kwargs={'username': self.auth_user.username})
        )
        first_object = response.context['page_obj'].object_list[0]
        self.assertEqual(first_object.id, self.post.id)
        self.assertEqual(first_object.text, self.post.text)
        self.assertEqual(first_object.author, self.auth_user)


class PaginatorViewsTest(TestModelFactory):
    """Проверяем Паджинатор"""

    def test_paginator_contains_all_records(self):
        """Проверка: Есть ли все записи в паджинаторе"""
        response = self.guest_client.get(reverse('index'))
        self.assertEqual(
            response.context['page_obj'].paginator.count, self.number_of_posts)

    def test_index_page_contains_ten_records(self):
        """Проверка: количество постов на первой странице равно 10."""
        response = self.guest_client.get(reverse('index'))
        self.assertEqual(len(response.context['page_obj']), 10)

    def test_group_list_contains_remainder_records(self):
        """Проверка: на последней странице group_list должно быть
        % десяти от всего количества постов."""
        remainder = self.number_of_posts % 10
        response = self.client.get(
            reverse('group_list', kwargs={
                    'group_slug': self.group.slug}) + f'?page={remainder}'
        )
        last_page_posts_num = response.context['page_obj'].paginator.count % 10
        self.assertEqual(last_page_posts_num, remainder)

    def test_profile_contains_remainder_records(self):
        """Проверка: на последней странице profile должно быть
        % десяти от всего количества постов."""
        remainder = self.number_of_posts % 10
        response = self.client.get(
            reverse('profile', kwargs={
                    'username': self.auth_user.username
                    }) + f'?page={remainder}'
        )
        last_page_posts_num = response.context['page_obj'].paginator.count % 10
        self.assertEqual(last_page_posts_num, remainder)
