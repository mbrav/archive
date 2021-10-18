from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, viewsets, status, filters
from rest_framework.response import Response
from posts.models import Post, Group, Comment, Follow
from .serializers import PostSerializer, GroupSerializer, CommentSerializer, FollowSerializer
from .permissions import IsAuthorOrReadOnlyPermission


class PostViewSet(viewsets.ModelViewSet):

    serializer_class = PostSerializer
    permission_classes = [
        permissions.IsAuthenticated, ]

    filter_backends = [filters.SearchFilter]
    search_fields = ['$text']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class GroupViewSet(viewsets.ModelViewSet):

    serializer_class = GroupSerializer
    permission_classes = [
        permissions.IsAuthenticated, ]

    def get_queryset(self):
        queryset = Group.objects.all()
        return queryset

    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CommentViewSet(viewsets.ModelViewSet):

    serializer_class = CommentSerializer
    permission_classes = [
        permissions.IsAuthenticated, ]

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
    permission_classes = [
        permissions.IsAuthenticated, ]

    def get_queryset(self):
        queryset = Follow.objects.all()
        return queryset

    def create(self, request):
        serializer.save(author=self.request.user)


# Импортируйте в код все необходимое
# from django_filters.rest_framework import DjangoFilterBackend


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filter_backends = [filters.SearchFilter]
    search_fields = ['$text']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthorOrReadOnlyPermission,)
