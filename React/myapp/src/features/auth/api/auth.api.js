import { BASE_URL, getCSRFToken } from '@/lib/api/client';

export const userLogin = async (credentials) => {
    const response = await fetch(`${BASE_URL}login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 'X-CSRFToken': await getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to login');
    }
}

export const userRegister = async (userData) => {
    const response = await fetch(`${BASE_URL}register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 'X-CSRFToken': await getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify(userData),
    });

    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        console.log('Registration error from backend:', error);
        throw new Error(error.error || 'Failed to register');
    }
}

export const userLogout = async () => {
    const response = await fetch(`${BASE_URL}logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-CSRFToken': await getCSRFToken(),
        },
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to logout');
    }
}

export const forgotPassword = async (email) => {
    const response = await fetch(`${BASE_URL}forgot-password/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 'X-CSRFToken': await getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send verification code');
    }
}

export const verifyPin = async (email, pin) => {
    const response = await fetch(`${BASE_URL}verify-pin/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 'X-CSRFToken': await getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ email, pin }),
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify PIN');
    }
}

export const changePassword = async (email, pin, new_password) => {
    const response = await fetch(`${BASE_URL}change-password/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 'X-CSRFToken': await getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ email, pin, new_password }),
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
    }
}
