from rest_framework import serializers

from .models import Post, Group


class PostSerializer(serializers.ModelSerializer):

    group = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Group.objects.all(),
        required=False
    )


    class Meta:
        fields = ('id', 'text', 'author', 'image', 'pub_date', 'group')
        model = Post
