#  Импортируйте в код всё необходимое

from rest_framework.routers import SimpleRouter

from django.urls import include, path

from .views import PostViewSet

router = SimpleRouter()
router.register('api/v1/posts', PostViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 