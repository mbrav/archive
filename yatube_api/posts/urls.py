from django.urls import path
from .views import api_posts
from rest_framework.authtoken import views


urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token),
    path('posts/', api_posts),
]
