from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail, get_connection
from django.utils import timezone
import json
from django.conf import settings
from .models import Transaction, UserProfile, PasswordResetPin

# ---------------- Transactions ----------------
@csrf_exempt
@require_http_methods(["GET","POST"])
def transactions(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    try:
        user = UserProfile.objects.get(id=user_id)
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=user)
        data = [{
            'id': t.id,
            'title': t.title,
            'amount': str(t.amount),
            'transaction_type': t.transaction_type,
            'category': t.category,
            'date': t.date.isoformat(),
            'description': t.description,
            'user': t.user.username
        } for t in transactions]
        return JsonResponse({'transactions': data})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            transaction = Transaction.objects.create(
                user=user,
                title=data['title'],
                amount=data['amount'],
                transaction_type=data['transaction_type'],
                category=data['category'],
                description=data.get('description', data['title'])
            )
            return JsonResponse({
                'id': transaction.id,
                'title': transaction.title,
                'amount': str(transaction.amount),
                'transaction_type': transaction.transaction_type,
                'category': transaction.category,
                'date': transaction.date.isoformat(),
                'description': transaction.description
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

# ---------------- Transaction Detail ----------------
@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def transaction_detail(request, transaction_id):
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    try:
        user = UserProfile.objects.get(id=user_id)
        transaction = Transaction.objects.get(id=transaction_id, user=user)
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Transaction.DoesNotExist:
        return JsonResponse({'error': 'Transaction not found'}, status=404)

    if request.method == 'GET':
        data = {
            'id': transaction.id,
            'title': transaction.title,
            'amount': str(transaction.amount),
            'transaction_type': transaction.transaction_type,
            'category': transaction.category,
            'date': transaction.date.isoformat(),
            'description': transaction.description
        }
        return JsonResponse(data)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            transaction.title = data['title']
            transaction.amount = data['amount']
            transaction.transaction_type = data['transaction_type']
            transaction.category = data['category']
            transaction.description = data.get('description', '')
            transaction.save()
            return JsonResponse({
                'id': transaction.id,
                'title': transaction.title,
                'amount': str(transaction.amount),
                'transaction_type': transaction.transaction_type,
                'category': transaction.category,
                'date': transaction.date.isoformat(),
                'description': transaction.description
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        transaction.delete()
        return JsonResponse({'message': 'Transaction deleted successfully'})

# ---------------- User Auth ----------------
@csrf_exempt
@require_http_methods(["POST"])
def user_login(request):   
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        try:
            user = UserProfile.objects.get(email=email)
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'Email is invalid'}, status=400)
        
        if user.check_password(password):
            request.session['user_id'] = user.id
            request.session['username'] = user.username
            request.session['email'] = user.email
            return JsonResponse({
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            })
        else:
            return JsonResponse({'error': 'Password is invalid'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    try:
        data = json.loads(request.body)
        if UserProfile.objects.filter(username=data['username']).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        if UserProfile.objects.filter(email=data['email']).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        user = UserProfile(
            username=data['username'],
            email=data['email'],
            phone=data.get('phone', '')
        )
        user.set_password(data['password'])
        user.save()
        return JsonResponse({
            'message': 'User registered successfully',
            'user_id': user.id,
            'username': user.username
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def user_logout(request):
    request.session.flush()
    return JsonResponse({'message': 'Logout successful'})

# ---------------- Password Reset ----------------
@csrf_exempt
@require_http_methods(["POST"])
def forgot_password(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
        
        user = UserProfile.objects.get(email=email)
        PasswordResetPin.objects.filter(user=user, is_used=False).delete()
        reset_pin = PasswordResetPin.objects.create(user=user, email=email)
        
        # Send email with PIN
        try:
            send_mail(
                'Password Reset PIN',
                f'Your verification code is: {reset_pin.pin}\nThis code expires in 1 minute.',
                f'Finance Tracker <{settings.DEFAULT_FROM_EMAIL}>',
                [email],
                fail_silently=False,
            )
            return JsonResponse({'message': 'PIN sent to your email', 'email': email})
        except Exception as e:
            return JsonResponse({'error': f'Failed to send email: {str(e)}'}, status=500)
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'Email not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def verify_pin(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        pin = data.get('pin')
        if not email or not pin:
            return JsonResponse({'error': 'Email and PIN are required'}, status=400)
        
        user = UserProfile.objects.get(email=email)
        reset_pin = PasswordResetPin.objects.filter(user=user, pin=pin, is_used=False).first()
        if not reset_pin:
            return JsonResponse({'error': 'Invalid PIN or email'}, status=400)
        
        if reset_pin.is_expired():
            return JsonResponse({'error': 'PIN has expired'}, status=400)

        return JsonResponse({'message': 'PIN verified successfully', 'email': email})
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'Invalid PIN or email'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def change_password(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        pin = data.get('pin')
        new_password = data.get('new_password')
        if not email or not pin or not new_password:
            return JsonResponse({'error': 'Email, PIN and new password are required'}, status=400)
        
        user = UserProfile.objects.get(email=email)
        reset_pin = PasswordResetPin.objects.filter(user=user, pin=pin, is_used=False).first()
        if not reset_pin:
            return JsonResponse({'error': 'Session expired. Please start over.'}, status=400)

        user.set_password(new_password)
        user.save()
        reset_pin.is_used = True
        reset_pin.save()

        return JsonResponse({'message': 'Password changed successfully'})
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'Session expired. Please start over.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
