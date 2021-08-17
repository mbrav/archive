from django.contrib.auth import forms
from django.urls import reverse_lazy
from django.views import generic


class SignUpView(generic.CreateView):
    form_class = forms.UserCreationForm
    success_url = reverse_lazy('index')
    template_name = 'users/signup.html'
