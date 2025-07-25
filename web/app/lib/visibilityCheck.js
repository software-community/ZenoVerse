// We can initialize the environment variables later for now the server will use the default URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const isVisible = async ({ constellation, latitude, longitude, timestamp}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/constellation-visibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        constellation,
        latitude,
        longitude,
        timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error(`Visibility API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.visible;
  } catch (error) {
    console.error('Error checking visibility:', error);
    return false;
  }
}