from django.shortcuts import render


def author(request):
    return render(request, 'about/author.html')


def tech(request):
    return render(request, 'about/tech.html')
