from django.shortcuts import render


def index(request):
    return render(request, 'posts/index.html')


def profile(request, username):
    return render(
        request,
        'posts/profile.html',
        # {'profile': profile}
    )


def group_list(request, slug):
    return render(
        request,
        'posts/group_list.html',
        # {'group': group}
    )


def post(request, post_id):
    return render(
        request,
        'posts/post_detail.html',
        # {'post': post}
    )


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
