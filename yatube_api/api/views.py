from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from posts.models import Post, Group, Comment, Follow
from .serializers import (
    PostSerializer,
    GroupSerializer,
    CommentSerializer,
    FollowSerializer
)

User = get_user_model()


class PostViewSet(viewsets.ModelViewSet):

    serializer_class = PostSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['$text']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset


class GroupViewSet(viewsets.ModelViewSet):

    serializer_class = GroupSerializer

    def get_queryset(self):
        queryset = Group.objects.all()
        return queryset

    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CommentViewSet(viewsets.ModelViewSet):

    serializer_class = CommentSerializer
    pagination_class = None

    def get_queryset(self, *args, **kwargs):
        post_id = self.kwargs.get('post_id')
        get_object_or_404(Post, pk=post_id)
        queryset = Comment.objects.filter(post_id=post_id)
        return queryset

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        get_object_or_404(Post, pk=post_id)
        serializer.save(author=self.request.user)


class FollowViewSet(viewsets.ModelViewSet):

    serializer_class = FollowSerializer
    pagination_class = None
    filter_backends = (filters.SearchFilter,)
    search_fields = ('=user__username', '=author__username')

    def get_queryset(self):
        user = get_object_or_404(User, username=self.request.user)
        return Follow.objects.filter(user=user)

    def perform_create(self, serializer):
        user = get_object_or_404(User, username=self.request.user)
        following = serializer.initial_data.get('following')
        author = get_object_or_404(User, username=following)

        if serializer.is_valid():
            serializer.save(user=user, author=author)
