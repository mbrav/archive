#  импортируйте в код всё необходимое
from rest_framework import viewsets, serializers

from .models import Post, Group
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer