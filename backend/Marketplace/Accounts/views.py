from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import SignupSerializer, LoginSerializer, PasswordResetRequestSerializer, SetNewPasswordSerializer, ProfileSerializer
from rest_framework.response import Response
from django.utils.encoding import force_str, smart_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status, generics, permissions
from .models import Profile

@api_view(['POST'])
@permission_classes([AllowAny])   
def Signupview(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": SignupSerializer(user).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny]) 
def Loginview(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Login successful",
                "user": SignupSerializer(user).data,  # 👈 show consistent user info
                "token": token.key
            }, status=status.HTTP_200_OK)  # 👈 fixed
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    

class ProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile  
    
@api_view(['POST'])
def request_password_reset_email(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data['email']

    user = User.objects.filter(email=email).first()

    if user:
        uidb64 = urlsafe_base64_encode(smart_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)

        reset_url = f"http://localhost:3000/reset-password/{uidb64}/{token}/"

        # Debug
        print('✅ RESET URL:', reset_url)

        send_mail(
            subject='Password Reset Request',
            message=f'Hi {user.username},\n\nClick the link to reset your password:\n{reset_url}\n\nIf you did not request this, please ignore.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

    return Response(
        {'success': 'If your email exists, we sent a password reset link.'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def password_token_check(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid UID'}, status=status.HTTP_400_BAD_REQUEST)

    if not PasswordResetTokenGenerator().check_token(user, token):
        return Response({'error': 'The reset link is invalid or expired.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'success': 'Token is valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)


@api_view(['POST'])
def password_reset_confirm(request, uidb64, token):
    serializer = SetNewPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    password = serializer.validated_data.get('password')

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid UID'}, status=status.HTTP_400_BAD_REQUEST)

    if not PasswordResetTokenGenerator().check_token(user, token):
        return Response({'error': 'The reset link is invalid or expired.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(password)
    user.save()

    return Response({'success': 'Password reset successful!'}, status=status.HTTP_200_OK)


