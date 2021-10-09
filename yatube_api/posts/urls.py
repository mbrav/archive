from django.urls import path, include
from .views import PostViewSet, GroupViewSet, CommentViewSet
from rest_framework import routers
from rest_framework.authtoken import views


router = routers.DefaultRouter()
router.register('posts', PostViewSet, basename='posts')
router.register('groups', GroupViewSet, basename='groups')

urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token),
    path('', include(router.urls)),
]
