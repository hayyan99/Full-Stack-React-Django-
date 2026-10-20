import { BASE_URL, getCSRFToken } from '@/lib/api/client';

export const fetchTransactions = async () => {
    const response = await fetch(`${BASE_URL}transactions/`, {
        credentials: 'include'
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch transactions');
    }
}

export const createTransaction = async (transaction) => {
    const response = await fetch(`${BASE_URL}transactions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 'X-CSRFToken': await getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify(transaction)
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create transaction');
    }
}

export const deleteTransaction = async (transaction) => {
    const response = await fetch(`${BASE_URL}transactions/${transaction.id}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'X-CSRFToken': await getCSRFToken(),
        },
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete transaction');
    }
}
