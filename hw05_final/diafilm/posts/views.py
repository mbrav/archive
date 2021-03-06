from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.cache import cache_page

from .forms import CommentForm, PostForm
from .models import Comment, Follow, Group, Post, User
from diafilms.models import Film


@cache_page(60)
def index(request):
    diafilms = request.GET.get('diafilms')
    page_number = request.GET.get('page')

    post_list = None
    if diafilms:
        post_list = Film.objects.select_related(
            'group', 'author', 'cover').all().order_by('-id')
    else:
        films = Film.objects.all().values_list('id')
        post_list = Post.objects.select_related('group', 'author').exclude(
            id__in=films).all().order_by('-pub_date')

    paginator = Paginator(post_list, 10)
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'diafilms': diafilms,
        'index': True,
    }

    return render(request, 'posts/index.html', context)


def profile(request, username):
    diafilms = request.GET.get('diafilms')
    page_number = request.GET.get('page')

    author = get_object_or_404(User, username=username)
    post_list = None
    if diafilms:
        post_list = Film.objects.select_related(
            'group', 'author', 'cover').filter(author=author).order_by('-id')
    else:
        films = Film.objects.all().values_list('id')
        post_list = Post.objects.select_related(
            'group', 'author').filter(author=author).exclude(id__in=films).order_by('-pub_date')

    following = False
    if request.user.is_authenticated:
        following = Follow.objects.filter(
            user=request.user, author=author).first() is not None

    paginator = Paginator(post_list, 10)
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'diafilms': diafilms,
        'author': author,
        'following': following,
    }

    return render(request, 'posts/profile.html', context)


def group_list(request, group_slug):
    diafilms = request.GET.get('diafilms')
    page_number = request.GET.get('page')

    group = get_object_or_404(Group, slug=group_slug)

    post_list = None
    if diafilms:
        post_list = Film.objects.select_related(
            'group', 'author', 'cover').filter(group=group).order_by('-id')
    else:
        films = Film.objects.all().values_list('id')
        post_list = Post.objects.select_related('group', 'author').filter(
            group=group).exclude(id__in=films).order_by('-pub_date')

    paginator = Paginator(post_list, 10)
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'diafilms': diafilms,
        'group': group,
    }

    return render(request, 'posts/group_list.html', context)


def diafilms(request):
    page_number = request.GET.get('page')
    query = request.GET.get('q')

    post_list = None
    if query:
        post_list = Film.objects.filter(name__icontains=query).order_by('id')
    else:
        post_list = Film.objects.all().order_by('id')

    paginator = Paginator(post_list, 100)
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'query': query,
    }

    return render(request, 'posts/diafilm_list.html', context)


@login_required(login_url='/auth/login/')
def follow_index(request):
    diafilms = request.GET.get('diafilms')
    page_number = request.GET.get('page')

    usernames = Follow.objects.filter(
        user=request.user).values_list('author')
    post_list = None
    if diafilms:
        post_list = Film.objects.select_related('group', 'author', 'cover').filter(
            author__in=usernames).order_by('-id')
    else:
        films = Film.objects.all().values_list('id')
        post_list = Post.objects.select_related('group', 'author').filter(
            author__in=usernames).exclude(id__in=films).order_by('-pub_date')

    paginator = Paginator(post_list, 10)
    page = paginator.get_page(page_number)

    context = {
        'page_obj': page,
        'diafilms': diafilms,
        'following': usernames,
    }

    return render(request, 'posts/follow_list.html', context)


@login_required(login_url='/auth/login/')
def profile_follow(request, username):
    author = get_object_or_404(User, username=username)

    if author != request.user:
        Follow.objects.get_or_create(
            user=request.user,
            author=author)

    return redirect('posts:follow_list')


@login_required(login_url='/auth/login/')
def profile_unfollow(request, username):
    author = get_object_or_404(User, username=username)

    follow = Follow.objects.filter(
        user=request.user,
        author=author)

    if follow.exists():
        follow.delete()

    return redirect('posts:follow_list')


def post(request, post_id):
    frames, post = None, None
    if Film.objects.filter(id=post_id).exists():
        post = get_object_or_404(Film.objects.select_related('group', 'author', 'cover').prefetch_related(
            'comments__post', 'comments__author', 'frames__film'), id=post_id)
        frames = post.frames
    else:
        post = get_object_or_404(Post.objects.select_related(
            'group', 'author').prefetch_related('comments__post', 'comments__author'), id=post_id)

    posts_by_user = Post.objects.filter(
        author=post.author).count()

    following = False
    if request.user.is_authenticated:
        following = Follow.objects.filter(
            user=request.user, author=post.author).first() is not None

    form = CommentForm(None)

    is_edit = request.user == post.author

    context = {
        'post': post,
        'frames': frames,
        'form': form,
        'posts_by_user': posts_by_user,
        'is_edit': is_edit,
        'following': following,
    }

    return render(request, 'posts/post_detail.html', context)


@login_required(login_url='/auth/login/')
def post_create(request):
    form = PostForm(
        request.POST or None,
        files=request.FILES or None,)
    if request.method == 'POST' and form.is_valid():
        post = form.save(commit=False)
        post.author = request.user
        post.save()
        return redirect('posts:profile', username=post.author.username)

    context = {
        'form': form,
    }

    return render(request, 'posts/create_post.html', context)


@login_required(login_url='/auth/login/')
def post_edit(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    form = PostForm(
        request.POST or None,
        instance=post,
        files=request.FILES or None,)
    if request.method == "POST" and form.is_valid():
        post = form.save(commit=False)
        post.save()
        return redirect(
            'posts:post',
            post_id=post_id)

    is_edit = request.user == post.author

    context = {
        'form': form,
        'username': request.user,
        'is_edit': is_edit,
        'post': post
    }

    return render(request, 'posts/update_post.html', context)


@login_required(login_url='/auth/login/')
def post_delete(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if post.author == request.user:
        post.delete()

    return redirect('posts:index')


@login_required(login_url='/auth/login/')
def add_comment(request, post_id):
    form = CommentForm(request.POST or None)
    post = get_object_or_404(Post, id=post_id)
    if form.is_valid():
        comment = form.save(commit=False)
        comment.author = request.user
        comment.post = post
        comment.save()

    return redirect('posts:post', post_id=post.id)


@login_required(login_url='/auth/login/')
def delete_comment(request, post_id, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)

    if comment.author == request.user:
        comment.delete()

    return redirect('posts:post', post_id=post_id)
