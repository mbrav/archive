from rest_framework import serializers
from .models import Post, Group, Comment


class PostSerializer(serializers.ModelSerializer):
    comment_count = serializers.SerializerMethodField(
        method_name='get_comment_count')
    author = serializers.StringRelatedField()

    class Meta:
        model = Post
        read_only_fields = ('comment_count',)
        exclude = [
        ]

    def get_comment_count(self, obj):
        return Comment.objects.filter(post=obj).count()

    def get_author_name(self, obj):
        return obj.author.username


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        read_only_fields = ()
        exclude = [
        ]


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(
        method_name='get_author_name')

    class Meta:
        model = Comment
        read_only_fields = ()
        exclude = [
        ]

    def get_author_name(self, obj):
        return obj.author.username
