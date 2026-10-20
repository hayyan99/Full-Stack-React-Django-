from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail, get_connection
from django.utils import timezone
import json
from django.middleware.csrf import get_token
from django.conf import settings
from .serializers import UserLoginSerializer, UserRegisterSerializer, TransactionSerializer
from .models import Transaction, UserProfile, PasswordResetPin, FAQ, ContactInfo
from django_ratelimit.decorators import ratelimit
from .chatbot_services import get_chatbot_response
from .models import ChatMessage

# -----------CSRF Exempt Decorator-----------
@require_http_methods(["GET"])
def csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

# ---------------- Transactions ----------------
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
            serializer = TransactionSerializer(data=json.loads(request.body))
            if not serializer.is_valid():
                first_error = next(iter(serializer.errors.values()))[0]
                return JsonResponse({'error': first_error}, status=400)
            
            transaction = Transaction.objects.create(
                user=user, **serializer.validated_data
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
            serializer = TransactionSerializer(data=json.loads(request.body))
            if not serializer.is_valid():
                first_error = next(iter(serializer.errors.values()))[0]
                return JsonResponse({'error': first_error}, status=400)
            data = serializer.validated_data
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
@ratelimit(key='ip', rate='5/m', method='POST', block= False)
@require_http_methods(["POST"])
def user_login(request):
    if getattr(request, 'limited', False):
        return JsonResponse({'error': 'Too many login attempts. Please try again later.'}, status=429)
    try:
        serializer = UserLoginSerializer(data=json.loads(request.body))
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0]
            return JsonResponse({'error': first_error}, status=400)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
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
    
@ratelimit(key='ip', rate='3/m', method='POST', block= False)
@require_http_methods(["POST"])
def register(request):
    if getattr(request, 'limited', False):
        return JsonResponse({'error': 'Too many registration attempts. Please try again later.'}, status=429)
    try:
        serializer = UserRegisterSerializer(data=json.loads(request.body))
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0]
            return JsonResponse({'error': first_error}, status=400)
        
        data = serializer.validated_data
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

@require_http_methods(["POST"])
def user_logout(request):
    request.session.flush()
    return JsonResponse({'message': 'Logout successful'})

# ---------------- Password Reset ----------------
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

@require_http_methods(['GET'])
def faq_list(request):
    faqs = FAQ.objects.filter(is_active=True)
    data = [{
        'id': faq.id,
        'question': faq.question,
        'answer': faq.answer,
        'created_at': faq.created_at.isoformat(),
        'updated_at': faq.updated_at.isoformat()
    } for faq in faqs]
    return JsonResponse({'faqs': data})

@require_http_methods(['GET'])
def contact_info(request):
    contacts = ContactInfo.objects.filter(is_active=True)
    data = [{
        'id': contact.id,
        'contact_type': contact.contact_type,
        'label': contact.label,
        'value': contact.value,
        'created_at': contact.created_at.isoformat(),
        'updated_at': contact.updated_at.isoformat()
    } for contact in contacts]
    return JsonResponse({'contacts': data})

@csrf_exempt
@require_http_methods(["POST"])
def chatbot_query(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    try:
        user = UserProfile.objects.get(id=user_id)
        data = json.loads(request.body)
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)
        
        # Get last 5 messages for context
        recent_messages = ChatMessage.objects.filter(
            user=user, 
            session_id=session_id
        )[:5]
        
        chat_history = [
            {'user': msg.message, 'bot': msg.response} 
            for msg in reversed(recent_messages)
        ]
        
        # Get user transaction context
        from decimal import Decimal
        transactions = Transaction.objects.filter(user=user)[:20]
        total_income = sum((Decimal(str(t.amount)) for t in transactions if t.transaction_type == 'income'), Decimal('0'))
        total_expense = sum((Decimal(str(t.amount)) for t in transactions if t.transaction_type == 'expense'), Decimal('0'))
        
        # Category breakdown
        from collections import defaultdict
        expenses_by_category = defaultdict(Decimal)
        for t in transactions:
            if t.transaction_type == 'expense':
                expenses_by_category[t.category] += Decimal(str(t.amount))

        category_text = ", ".join([f"{cat}: {amt}PKR" for cat, amt in expenses_by_category.items()])

        user_context = f"User's recent data: Total income: {total_income}PKR, Total expenses: {total_expense}PKR. Expense breakdown by category: {category_text if category_text else 'No expenses recorded yet'}"

        # Get response
        response = get_chatbot_response(user_message, chat_history, user_context)
        
        # Save to database
        ChatMessage.objects.create(
            user=user,
            message=user_message,
            response=response,
            session_id=session_id
        )
        
        return JsonResponse({
            'response': response,
            'timestamp': timezone.now().strftime("%Y-%m-%d %I:%M:%S %p")
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

