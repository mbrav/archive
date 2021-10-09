from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
# from rest_framework import permissions
from rest_framework.decorators import api_view, action
from .models import Post, Group, Comment
from .serializers import PostSerializer, GroupSerializer, CommentSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()

    def list(self, request):
        serializer = PostSerializer(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        post = get_object_or_404(self.queryset, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    @action(methods=['get', 'post'], detail=True, url_path='comments', url_name='comments')
    def get_post_comments(self, request, pk=None):
        post = get_object_or_404(self.queryset, pk=pk)
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    # @action(detail=True, methods=['create'], permission_classes=[permissions.IsAuthenticated])
    def create(self, request, *args, **kwargs):
        Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class GroupViewSet(viewsets.ModelViewSet):
    def list(self, request):
        queryset = Group.objects.all()
        serializer = GroupSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Group.objects.all()
        group = get_object_or_404(queryset, pk=pk)
        serializer = GroupSerializer(group)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    def list(self, request):
        queryset = Comment.objects.all()
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.all()
        comment = get_object_or_404(queryset, pk=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
