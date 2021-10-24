from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PostViewSet,
    GroupViewSet,
    CommentViewSet,
    FollowViewSet,
)


router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'groups', GroupViewSet, basename='groups')
router.register(r'posts/(?P<post_id>\d+)/comments',
                CommentViewSet, basename='comments')
router.register(r'follow', FollowViewSet, basename='followers')


urlpatterns = [
    path('v1/', include('djoser.urls')),
    path('v1/', include('djoser.urls.jwt')),
    path('v1/', include(router.urls)),
]
