import constant from './constant';

const BASE_URL = constant.BASE_URL;

const getCSRFToken = async() => {
    const response = await fetch(`${BASE_URL}csrf-token/`,{
        credentials: 'include'
    }); 
    const data = await response.json();
    return data.csrfToken;
};

export const sendChatMessage = async (message, sessionId) => {
  const response = await fetch(`${BASE_URL}chatbot/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': await getCSRFToken(),
    },
    credentials: 'include',
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (response.ok) {
    return response.json();
  } else {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }
};
