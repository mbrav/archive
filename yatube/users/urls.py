from django.contrib.auth import views
from django.urls import path
from .views import SignUpView, logout

urlpatterns = [
    path('login/',
         views.LoginView.as_view(template_name='users/login.html'),
         name='login'),
    path('signup/',
         SignUpView.as_view(),
         name='signup'),
    path('logout/',
         logout,
         name='logout'),
]
