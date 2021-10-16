from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Group(models.Model):
    title = models.CharField(
        max_length=200,
        verbose_name='Имя категории постов',
    )

    slug = models.SlugField(
        unique=True,
        verbose_name='Slug категории постов',
    )

    description = models.TextField(
        verbose_name='Описание категории постов',
    )

    def __str__(self):
        return self.title


class Post(models.Model):
    text = models.TextField(
        verbose_name='Текст',
        help_text='Напишите текст поста',
    )

    pub_date = models.DateTimeField(
        'Дата публикации поста',
        auto_now_add=True,
        help_text='Укажите дату публикации поста',
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posts'
    )

    image = models.ImageField(
        upload_to='posts/',
        null=True,
        blank=True
    )

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="posts",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.text


class Comment(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Комменты пользователя',
        help_text='Укажите автора коммента',
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Комменты поста',
        help_text='Укажите пост коммента',
    )

    text = models.TextField(
        verbose_name='Текст комментария',
        help_text='Напишите текст комментария',
    )

    created = models.DateTimeField(
        'Дата добавления',
        auto_now_add=True,
        db_index=True
    )


class Follow(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='follower',
        verbose_name='Подпискa пользователя',
        help_text='Укажите пользователя подписки',
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='following',
        verbose_name='Подписка на пользователя',
        help_text='Укажите пользователя на которого подписываются',
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата подписки',
        help_text='Укажите дату и время начала подписки на пользователя',
        db_index=True,
    )

    class Meta:
        ordering = ('-created',)
        verbose_name = 'Подписка'
        verbose_name_plural = 'Подписки'

    def __str__(self):
        return f'{self.user}'
