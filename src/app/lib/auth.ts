const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MASTER_TOKEN = process.env.NEXT_PUBLIC_MASTER_TOKEN;

export async function loginUser(correo_electronico: string, contraseña: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MASTER_TOKEN}`
    },
    body: JSON.stringify({ correo_electronico, contraseña })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function getUserProfile(token: string) {
  const response = await fetch(`${API_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
}

