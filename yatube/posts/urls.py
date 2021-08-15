from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('profile/<slug:username>/', views.profile, name='profile'),
    path('group/<slug:group_slug>/', views.group_list, name='group_list'),
    path('posts/<int:post_id>/', views.post, name='post'),
    path('posts/edit/', views.create_post, name='create_post'),
    path('posts/<int:post_id>/edit/', views.update_post, name='update_post'),
]
