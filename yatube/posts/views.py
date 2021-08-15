from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404
from .models import User, Post, Group
from .forms import PostForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect


def index(request):
    post_list = Post.objects.all().order_by('-pub_date')
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
    }
    return render(request, 'posts/index.html', context)


def profile(request, username):
    post_list = Post.objects.filter(
        author__username=username).order_by('-pub_date')
    profile = User.objects.get(username=username)
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'profile': profile,
    }
    return render(request, 'posts/profile.html', context)


def group_list(request, group_slug):
    post_list = Post.objects.filter(
        group__slug=group_slug).order_by('-pub_date')
    group = Group.objects.get(slug=group_slug)
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'group': group,
    }
    return render(request, 'posts/group_list.html', context)


def post(request, post_id):
    post = Post.objects.get(id=post_id)

    context = {
        'post': post,
    }
    return render(request, 'posts/post_detail.html', context)


@login_required
def post_create(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('profile', username=post.author)
    else:
        form = PostForm()

    context = {
        'form': form,
    }
    return render(request, 'posts/create_post.html', context)


@login_required
def post_edit(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post.author = request.user
            post = form.save(commit=False)
            post.save()
            return redirect('post', post.id)
    else:
        form = PostForm(instance=post)

    context = {
        'form': form,
        'username': request.user,
        'is_edit': True,
        'post': post
    }
    return render(request, 'posts/update_post.html', context)
