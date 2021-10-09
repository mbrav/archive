from rest_framework import serializers
from .models import Post, Group, Comment


class PostSerializer(serializers.ModelSerializer):
    comment_count = serializers.SerializerMethodField(
        method_name='post_comment_count')

    class Meta:
        model = Post
        read_only_fields = ('comment_count',)
        exclude = [
        ]

    def post_comment_count(self, obj):
        return Comment.objects.filter(post=obj).count()


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        read_only_fields = ()
        exclude = [
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        read_only_fields = ()
        exclude = [
        ]
