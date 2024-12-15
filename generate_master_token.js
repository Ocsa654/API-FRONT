const fetch = require('node-fetch');

async function generateMasterToken() {
  const url = 'http://localhost:8000/api/generate-master-token';
  const secretKey = 'ClaveSecretaMuySegura'; // Este debe coincidir con MASTER_SECRET_KEY en tu .env

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ secret_key: secretKey }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Tu token maestro es:', data.master_token);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Error de red:', error.message);
  }
}

generateMasterToken();