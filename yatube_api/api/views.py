from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from posts.models import Post, Group, Comment, Follow
from .permissions import IsAuthorOrReadOnlyPermission, ReadOnly
from .serializers import (
    PostSerializer,
    GroupSerializer,
    CommentSerializer,
    FollowSerializer
)
from rest_framework.pagination import LimitOffsetPagination

User = get_user_model()


class PostViewSet(viewsets.ModelViewSet):

    queryset = Post.objects.all()
    serializer_class = PostSerializer

    permission_classes = (IsAuthorOrReadOnlyPermission,)
    pagination_class = LimitOffsetPagination

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class GroupViewSet(viewsets.ModelViewSet):

    serializer_class = GroupSerializer
    permission_classes = (ReadOnly,)


class CommentViewSet(viewsets.ModelViewSet):

    serializer_class = CommentSerializer
    permission_classes = (IsAuthorOrReadOnlyPermission,)

    def get_queryset(self, *args, **kwargs):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, pk=post_id)
        queryset = Comment.objects.filter(post=post)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FollowViewSet(viewsets.ModelViewSet):

    serializer_class = FollowSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('following__username',)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
