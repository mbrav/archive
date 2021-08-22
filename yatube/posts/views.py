from django.shortcuts import redirect, render, get_object_or_404
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from .models import User, Post, Group
from .forms import PostForm


def index(request):
    post_list = Post.objects.select_related('group').select_related(
        'author').all().order_by('-pub_date')
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
    }
    return render(request, 'posts/index.html', context)


def profile(request, username):
    post_list = Post.objects.select_related('group').filter(
        author__username=username).order_by('-pub_date')
    profile = get_object_or_404(User, username=username)
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'profile': profile,
        'post_count': paginator.count,
    }
    return render(request, 'posts/profile.html', context)


def group_list(request, group_slug):
    post_list = Post.objects.select_related('group', 'author').filter(
        group__slug=group_slug).order_by('-pub_date')
    group = get_object_or_404(Group, slug=group_slug)
    paginator = Paginator(post_list, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'group': group,
    }
    return render(request, 'posts/group_list.html', context)


def post(request, post_id):
    post = get_object_or_404(Post.objects.select_related(
        'group', 'author'), id=post_id)

    posts_by_user = Post.objects.filter(
        author=post.author).count()

    is_edit = request.user == post.author

    context = {
        'post': post,
        'posts_by_user': posts_by_user,
        'is_edit': is_edit,
    }
    return render(request, 'posts/post_detail.html', context)


@login_required
def post_create(request):
    form = PostForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('profile', username=post.author)

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

    is_edit = request.user == post.author

    context = {
        'form': form,
        'username': request.user,
        'is_edit': is_edit,
        'post': post
    }
    return render(request, 'posts/update_post.html', context)
