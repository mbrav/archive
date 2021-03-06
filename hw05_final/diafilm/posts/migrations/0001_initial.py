# Generated by Django 2.2.16 on 2021-09-07 11:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, unique=True)),
                ('slug', models.SlugField(max_length=200, unique=True)),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'verbose_name': 'Группа',
                'verbose_name_plural': 'Группы',
            },
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(help_text='Напишите текст поста', verbose_name='Текст')),
                ('pub_date', models.DateTimeField(auto_now_add=True, help_text='Укажите дату публикации поста', verbose_name='Дата публикации поста')),
                ('image', models.ImageField(blank=True, upload_to='posts/', verbose_name='Картинка')),
                ('author', models.ForeignKey(help_text='Укажите автора поста', on_delete=django.db.models.deletion.CASCADE, related_name='posts', to=settings.AUTH_USER_MODEL, verbose_name='Автор поста')),
                ('group', models.ForeignKey(blank=True, help_text='Укажите группу поста', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='posts', to='posts.Group', verbose_name='Группа поста')),
            ],
            options={
                'verbose_name': 'Пост',
                'verbose_name_plural': 'Посты',
                'ordering': ('-pub_date',),
            },
        ),
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, help_text='Укажите дату и время начала подписки на пользователя', verbose_name='Дата подписки')),
                ('author', models.ForeignKey(help_text='Укажите пользователя на которого подписываются', on_delete=django.db.models.deletion.CASCADE, related_name='following', to=settings.AUTH_USER_MODEL, verbose_name='Подписка на пользователя')),
                ('user', models.ForeignKey(help_text='Укажите пользователя подписки', on_delete=django.db.models.deletion.CASCADE, related_name='follower', to=settings.AUTH_USER_MODEL, verbose_name='Подпискa пользователя')),
            ],
            options={
                'verbose_name': 'Подписка',
                'verbose_name_plural': 'Подписки',
                'ordering': ('-created',),
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(help_text='Напишите текст комментария', verbose_name='Текст комментария')),
                ('created', models.DateTimeField(auto_now_add=True, help_text='Укажите дату и время публикации комментария', verbose_name='Дата публикации комментария')),
                ('author', models.ForeignKey(help_text='Укажите автора коммента', on_delete=django.db.models.deletion.CASCADE, related_name='comments', to=settings.AUTH_USER_MODEL, verbose_name='Комменты пользователя')),
                ('post', models.ForeignKey(blank=True, help_text='Укажите пост коммента', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='comments', to='posts.Post', verbose_name='Комменты поста')),
            ],
            options={
                'verbose_name': 'Коммент',
                'verbose_name_plural': 'Комменты',
            },
        ),
    ]
