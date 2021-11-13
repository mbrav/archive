from rest_framework import serializers
from .models import Post, Group, Comment


class PostSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField(
        method_name='get_comment_count')
    author = serializers.StringRelatedField()

    class Meta:
        model = Post
        read_only_fields = ('comments',)
        exclude = [
        ]

    def get_comment_count(self, obj):
        return Comment.objects.filter(post=obj).count()


class GroupSerializer(serializers.ModelSerializer):
    posts = serializers.SerializerMethodField(
        method_name='get_post_count')

    class Meta:
        model = Group
        read_only_fields = ('posts',)
        exclude = [
        ]

    def get_post_count(self, obj):
        return Post.objects.filter(group=obj).count()


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()

    class Meta:
        model = Comment
        read_only_fields = ()
        exclude = [
        ]
