import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.bereketakiso.com',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

export const apiCall = async <T>(config: import('axios').AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error response:', (error as any).response?.data);
    console.error('Error config:', (error as any).config);
    throw error;
  }
};

export default api;

export async function fetchAPI(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.bereketakiso.com';
  const res = await fetch(`${baseUrl}/api${endpoint}`);
  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}