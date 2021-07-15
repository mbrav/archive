from django.db import models
from django.contrib.auth import get_user_model


# Create your models here.
User = get_user_model() 


class Group(models.Model):

    title = models.CharField(max_length=255, unique=False, blank=False,)
    slug = models.CharField(max_length=255,)
    description = models.TextField(blank=True,)

    class Meta:
        verbose_name = 'Group'
        verbose_name_plural = 'Groups'

    def __str__(self):
        return "%s" % (self.title, )


class Post(models.Model):

    text = models.TextField(blank=True,)
    pub_date = models.DateTimeField(auto_now_add=True,)
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posts"
    )

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="posts"
    )

    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return "Post #%s" % (self.id, )
