from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework import permissions
from .permissions import IsOwnerOrReadOnly
from .models import Post, Group, Comment
from .serializers import PostSerializer, GroupSerializer, CommentSerializer


class PostViewSet(viewsets.ModelViewSet):

    serializer_class = PostSerializer
    permission_classes = [
        permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class GroupViewSet(viewsets.ModelViewSet):

    serializer_class = GroupSerializer
    permission_classes = [
        permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Group.objects.all()
        return queryset

    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CommentViewSet(viewsets.ModelViewSet):

    serializer_class = CommentSerializer
    permission_classes = [
        permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self, *args, **kwargs):
        post_id = self.kwargs.get('post_id')
        queryset = Comment.objects.filter(post_id=post_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
