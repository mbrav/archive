from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('profile/<slug:username>/', views.profile, name='profile'),
    path('group_list/', views.group_list, name='group_list'),
    path('post/<int:id>/', views.post, name='post'),
    path('create_post/', views.create_post, name='create_post'),
    path('update_post/<int:id>/', views.update_post, name='update_post'),
]

