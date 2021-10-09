from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Post, Group, Comment


class PostSerializer(ModelSerializer):
    comment_count = SerializerMethodField(
        method_name='get_comment_count')
    author = SerializerMethodField(
        method_name='get_author_name')

    class Meta:
        model = Post
        read_only_fields = ('comment_count',)
        exclude = [
        ]

    def get_comment_count(self, obj):
        return Comment.objects.filter(post=obj).count()

    def get_author_name(self, obj):
        return obj.author.username


class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        read_only_fields = ()
        exclude = [
        ]


class CommentSerializer(ModelSerializer):
    author = SerializerMethodField(
        method_name='get_author_name')

    class Meta:
        model = Comment
        read_only_fields = ()
        exclude = [
        ]

    def get_author_name(self, obj):
        return obj.author.username