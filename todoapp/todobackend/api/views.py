from rest_framework import generics, permissions
from .serializers import TodoSerializer, TodoToggleCompleteSerializer
from todo.models import Todo
from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework.parsers import JSONParser
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate

# Create your views here.

# ListCreateAPIView provides read-write endpoint.
# It is similar to ListAPIView but allows for creation as well


class TodoListCreate(generics.ListCreateAPIView):

    # ListAPIView requires two mandatory attributes(serializer_class and queryset)

    # We specify TodoSerializer which we have earlier implemented in "api/serializers.py"
    serializer_class = TodoSerializer

    # We specify that only authenticated users and registered users have permissions to call this API
    permission_classes = [permissions.IsAuthenticated]

    # get_queryset returns the queryset of todo objects for the view
    # we specify the queryset as all todo's which match the user
    # we order the todo by created date i.e we show the latest todo first
    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user).order_by('-created')

    # automatically assign a user when a todo is created
    # 'perform_create' acts as a hook which is called before the instance is created in the database
    def perform_create(self, serializer):  # serializer holds a django model
        serializer.save(user=self.request.user)


class TodoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # user can only update, delete own todo's
        return Todo.objects.filter(user=user)


# Toggle a todo from incomplete to complete and vice-versa
class TodoToggleComplete(generics.UpdateAPIView):
    serializer_class = TodoToggleCompleteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user)

    def perform_update(self, serializer):
        # we invert todo's completed boolean value(if true, set to false. if false, set to true)
        serializer.instance.completed = not (serializer.instance.completed)
        serializer.save()


# Importing csrf_exempt to allow this view to be called without a CSRF token
@csrf_exempt
def signup(request):
    # Check if the request method is POST
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request
            data = JSONParser().parse(request)
            # Create a new user with the provided username and password
            user = User.objects.create_user(
                username=data['username'], password=data['password'])
            # Save the user to the database
            user.save()
            # Create a token for the user
            token = Token.objects.create(user=user)
            # Return the token in a JSON response with a 201 status code
            return JsonResponse({'token': str(token)}, status=201)
        except IntegrityError:
            # Return an error message if the username is already taken
            return JsonResponse({'error': 'username taken. choose another username'}, status=400)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        username = data.get('username', '')
        password = data.get('password', '')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': str(token)}, status=200)
        else:
            return JsonResponse({'error': 'Unable to login. Check username and password.'}, status=400)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

# **********************************************************************************
