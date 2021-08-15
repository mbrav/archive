from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404
from .models import User, Post, Group


def index(request):
    post_list = Post.objects.all().order_by('-pub_date')
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page': page,
    }
    return render(request, 'posts/index.html', context)


def profile(request, username):
    post_list = Post.objects.filter(author__username=username)
    profile = User.objects.get(username=username)
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page': page,
        'profile': profile,
    }
    return render(request, 'posts/profile.html', context)


def group_list(request, group_slug):
    post_list = Post.objects.filter(group__slug=group_slug)
    group = Group.objects.get(slug=group_slug)
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page': page,
        'group': group,
    }
    return render(request, 'posts/group_list.html', context)


def post(request, post_id):
    post = Post.objects.get(id=post_id)

    context = {
        'post': post,
    }
    return render(request, 'posts/post_detail.html', context)


def create_post(request):
    return render(
        request,
        'posts/create_post.html',
        # {'post': post}
    )


def update_post(request, post_id):
    return render(
        request,
        'posts/update_post.html',
        # {'post': post}
    )
