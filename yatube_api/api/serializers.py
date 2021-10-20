from rest_framework import serializers
from rest_framework.relations import SlugRelatedField


from posts.models import Post, Group, Comment, Follow


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        fields = '__all__'
        model = Group


class PostSerializer(serializers.ModelSerializer):
    author = SlugRelatedField(slug_field='username', read_only=True)

    class Meta:
        fields = '__all__'
        model = Post


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(
        read_only=True, slug_field='username'
    )

    class Meta:
        fields = '__all__'
        model = Comment


class FollowSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field='username', read_only=True)
    following = serializers.SlugRelatedField(
        slug_field='username', read_only=True, source='author')


    def validate_following(self, following):
        user = self.context['request'].user
        follow_exists = Follow.object.filter(user=user, author=following).exists()
        if user != following and not follow_exists:
            return following
        raise serializers.ValidationError('Нельзя подписываться на себя!')

    class Meta:
        fields = ('user', 'following')
        read_only_fields = ('user',)
        model = Follow
