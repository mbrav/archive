from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def index(request):
    content = "Home"
    html = "<html><body>%s</body></html>" % content
    return HttpResponse(html)


def group_posts(request, group_slug):
    content = group_slug
    html = "<html><body>Group: %s</body></html>" % content
    return HttpResponse(html)
