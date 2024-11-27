import axios from 'axios';

export const logNavigation = async (action: string) => {
  try {
    await axios.post('/api/logs', { action });
  } catch (error) {
    console.error('Error logging navigation:', error);
  }
}; 