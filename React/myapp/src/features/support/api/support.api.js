import { BASE_URL } from '@/lib/api/client';

export const fetchFAQs = async () => {
    const response = await fetch(`${BASE_URL}faqs/`);
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch FAQs');
    }
}

export const fetchContactInfo = async () => {
    const response = await fetch(`${BASE_URL}contacts/`);
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch contact info');
    }
}
