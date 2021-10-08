from rest_framework import serializers
from .models import Post, Group, Comment


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        read_only_fields = ()
        exclude = [
        ]


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
