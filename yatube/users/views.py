from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.shortcuts import render
from django.views import generic


class SignUpView(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('users:login')
    template_name = 'users/signup.html'


def logout(request):
    return render(request, 'users/logged_out.html')
