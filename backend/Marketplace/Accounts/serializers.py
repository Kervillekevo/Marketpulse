from rest_framework import serializers
from django.contrib.auth.models import User
from.models import Profile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _

class SignupSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def validate(self, attrs):
        if attrs ['password1'] != attrs ['password2']:
             raise serializers.ValidationError({"error": "passwords do not match"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email']
        )
        user.set_password(validated_data['password1'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(required=True)


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    remove_photo = serializers.BooleanField(write_only=True, required=False)
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['username', 'email', 'bio', 'phone', 'profile_photo', 'remove_photo']

    def get_profile_photo(self, obj):
        if obj.profile_photo:
            return obj.profile_photo.url
        return None

    def update(self, instance, validated_data):
        if validated_data.pop('remove_photo', False):
            instance.profile_photo.delete(save=False)
            instance.profile_photo = None

        #Get photo from request.FILES directly
        request = self.context.get('request')
        if request and request.FILES.get('profile_photo'):
            instance.profile_photo = request.FILES['profile_photo']

        instance.bio = validated_data.get('bio', instance.bio)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()
        return instance
    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, min_length=6)
    