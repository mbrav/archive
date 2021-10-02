#  Импортируйте в код всё необходимое

from django.urls import include, path

from .views import APIPost, APIPostDetail

urlpatterns = [
    path('api/v1/posts/', APIPost.as_view()),
    path('api/v1/posts/<int:pk>/', APIPostDetail.as_view()),
] 
