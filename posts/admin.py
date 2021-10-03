from django.contrib import admin
from .models import Post, Group, Tag, TagPost, Follow

# Register your models here.

admin.site.register(Post)
admin.site.register(Group)
admin.site.register(Tag)
admin.site.register(TagPost)
admin.site.register(Follow)