from django.urls import path
from .views import (
    Signupview,
    Loginview,
    request_password_reset_email,
    password_token_check,
    password_reset_confirm,
    LogoutView,
    ProfileDetailView,
    test_email,
)

urlpatterns = [
    path("signup/", Signupview, name="signup"),
    path("login/", Loginview, name="login"),
    path("password-reset/", request_password_reset_email, name="password-reset"),
    path("password-reset-check/<uidb64>/<token>/", password_token_check, name="password-reset-check"),
    path("password-reset-confirm/<uidb64>/<token>/", password_reset_confirm, name="password-reset-confirm"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", ProfileDetailView.as_view(), name="profile-detail"),
    path("test-email/", test_email, name="test-email"),
]
