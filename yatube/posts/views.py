from django.shortcuts import render
from django.http import HttpResponse

from .models import Group, Post

# Create your views here.


def index(request):
    latest_posts = Post.objects.order_by('-pub_date')[:10]
    return render(request, 'index.html', {'title': 'Δом', 'posts': latest_posts})


def group_posts(request, group_slug):
    content = group_slug
    html = "<html><body>Group: %s</body></html>" % content
    return HttpResponse(html)
