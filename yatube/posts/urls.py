from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('profile/<str:username>', views.profile, name='profile'),
    path('group/<slug:group_slug>', views.group_list, name='group_list'),
    path('posts/<int:post_id>', views.post, name='post'),
    path('create', views.post_create, name='post_create'),
    path('posts/<int:post_id>/edit', views.post_edit, name='post_edit'),
]
