# Generated by Django 2.2.16 on 2021-09-07 11:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Film',
            fields=[
                ('post_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='posts.Post')),
                ('name', models.CharField(max_length=120)),
                ('url', models.CharField(blank=True, max_length=255, null=True)),
                ('studio', models.CharField(blank=True, max_length=120, null=True)),
                ('year', models.PositiveIntegerField(blank=True, null=True)),
                ('color', models.CharField(blank=True, max_length=120, null=True)),
                ('type', models.CharField(blank=True, max_length=120, null=True)),
                ('index', models.CharField(blank=True, max_length=120, null=True)),
                ('number', models.CharField(blank=True, max_length=120, null=True)),
                ('film_name', models.CharField(blank=True, max_length=120, null=True)),
                ('quality', models.CharField(blank=True, max_length=120, null=True)),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'verbose_name': 'Диафильм',
                'verbose_name_plural': 'Диафильмы',
                'ordering': ('-pub_date',),
            },
            bases=('posts.post',),
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pub_date', models.DateTimeField(auto_now_add=True, help_text='Укажите дату публикации картинки', verbose_name='Дата публикации картинки')),
                ('external', models.BooleanField(default=True, help_text='Укажите, если картинка внешняя')),
                ('image', models.ImageField(blank=True, upload_to='images/', verbose_name='Картинка')),
                ('url', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'Картинка',
                'verbose_name_plural': 'Картинки',
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('category', models.ForeignKey(help_text='Тэг, которая имеет группа', on_delete=django.db.models.deletion.CASCADE, related_name='tags', to='posts.Group')),
            ],
            options={
                'verbose_name': 'Tag',
                'verbose_name_plural': 'Tags',
            },
        ),
        migrations.CreateModel(
            name='FilmCover',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('film', models.OneToOneField(help_text='Диафильм, к которому привязана обложка', on_delete=django.db.models.deletion.CASCADE, related_name='cover', to='diafilms.Film')),
                ('image', models.ForeignKey(help_text='Картинка обложки', on_delete=django.db.models.deletion.CASCADE, related_name='cover', to='diafilms.Image')),
            ],
            options={
                'verbose_name': 'Обложка диафильма',
                'verbose_name_plural': 'Обложки диафильмов',
            },
        ),
        migrations.CreateModel(
            name='Frame',
            fields=[
                ('image_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='diafilms.Image')),
                ('sequence', models.PositiveIntegerField(blank=True, null=True)),
                ('film', models.ForeignKey(help_text='Кадры из которых состоит Диафильм', on_delete=django.db.models.deletion.CASCADE, related_name='frames', to='diafilms.Film')),
            ],
            options={
                'verbose_name': 'Кадр',
                'verbose_name_plural': 'Кадры',
            },
            bases=('diafilms.image',),
        ),
    ]