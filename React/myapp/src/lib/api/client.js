export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

export const getCSRFToken = async () => {
    const response = await fetch(`${BASE_URL}csrf-token/`, {
        credentials: 'include'
    });
    const data = await response.json();
    return data.csrfToken;
};
