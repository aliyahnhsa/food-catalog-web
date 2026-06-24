from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet
from .views import RegisterAPIView
from .views import MeAPIView

router = DefaultRouter()
router.register(r'menus', MenuItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterAPIView.as_view()),
    path('me/', MeAPIView.as_view()),
]