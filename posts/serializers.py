from rest_framework import serializers

from .models import Post


class CountLen(serializers.Field):
    def to_count_len(self, text):
        try:
            data = len(text)
        except ValueError:
            raise serializers.ValidationError('Для этого цвета нет имени')
        return data


class PostSerializer(serializers.ModelSerializer):
    character_quantity = serializers.SerializerMethodField()

    class Meta:
        fields = ('id', 'text', 'author', 'image',
                  'pub_date', 'character_quantity')
        model = Post

    def get_character_quantity(self, obj):
        return len(obj.text)
