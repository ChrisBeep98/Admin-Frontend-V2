const API_URL = 'https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api';

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ action: 'get_all_tours' }),
    });

    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};
