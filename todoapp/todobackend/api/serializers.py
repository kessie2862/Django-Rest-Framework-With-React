from rest_framework import serializers
from todo.models import Todo


class TodoSerializer(serializers.ModelSerializer):
    # Auto populated by app. User can't manipulate
    created = serializers.ReadOnlyField()
    completed = serializers.ReadOnlyField()

    class Meta:
        model = Todo
        # We specify the fields from our model we want to expose
        # DRF magically transforms our model data into JSON
        fields = ['id', 'title', 'memo', 'created', 'completed']


class TodoToggleCompleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id']  # why need to show id?
        read_only_fields = ['title', 'memo', 'created', 'completed']
