from django.shortcuts import render

from .models import Group, Post

# Create your views here.


def index(request):
    latest_posts = Post.objects.order_by('-pub_date')[:10]
    return render(
        request,
        'index.html',
        {'title': 'yatube', 'posts': latest_posts}
    )


def group_posts(request, group_slug):
    group = Group.objects.get(slug=group_slug)
    posts = Post.objects.filter(group__slug=group_slug)
    return render(
        request,
        'group_list.html',
        {'title': group.title, 'group': group, 'posts': posts}
    )
