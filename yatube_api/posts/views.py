from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.decorators import api_view, action
from .models import Post, Group, Comment
from .serializers import PostSerializer, GroupSerializer, CommentSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [
        permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def list(self, request):
        serializer = PostSerializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        post = get_object_or_404(self.queryset, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get', 'post'], detail=True, url_path='comments', url_name='comments')
    def post_comments(self, request, pk=None):
        if request.method == 'GET':
            post = get_object_or_404(self.queryset, pk=pk)
            comments = Comment.objects.filter(post=post)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            test = request.data
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None, partial=True):
        post = get_object_or_404(self.queryset, pk=pk)
        serializer = PostSerializer(post, data=request.data)

        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        post = get_object_or_404(self.queryset, pk=pk)
        if post.author == request.user:
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


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

    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


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
