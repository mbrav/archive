from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Group(models.Model):

    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True,)

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'

    def __str__(self):
        return f'{self.title}'


class Post(models.Model):

    text = models.TextField(
        verbose_name="Текст",
        help_text='Напишите текст поста',
    )

    pub_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата публикации поста",
        help_text="Укажите дату публикации поста",
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posts',
        verbose_name="Автор поста",
        help_text="Укажите автора поста",
    )

    group = models.ForeignKey(
        Group,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='posts',
        verbose_name="Группа поста",
        help_text="Укажите группу поста",
    )

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'

    def __str__(self):
        return f'{self.text[:15]}'
