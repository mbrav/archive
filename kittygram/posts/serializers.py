from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'text', 'author', 'image', 'pub_date')
        read_only_fields = ('author',)
        model = Post
        def get_post(self, request, pk=None):
            queryset = Post.objects.all()
            post = get_object_or_404(queryset, pk=pk)
            serializer = CatSerializer(post)
            return Response(serializer.data) 