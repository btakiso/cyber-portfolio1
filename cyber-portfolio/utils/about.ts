import { apiCall } from './api';
import { AboutData, Skill, Certification, Experience } from '../types/about';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://cyber-portfolio-72310aa69f55.herokuapp.com';

export const fetchAboutData = async (): Promise<AboutData> => {
  try {
    const response = await apiCall<AboutData[]>({
      method: 'GET',
      url: '/api/abouts',
      params: { populate: '*' },
    });

    console.log('About API response:', response);

    if (!Array.isArray(response) || response.length === 0) {
      throw new Error('No about data found');
    }

    return response[0];
  } catch (error) {
    console.error('Error fetching about data:', error);
    throw error;
  }
};

export async function fetchSkills(): Promise<Skill[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/skills?populate=*`);
    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
}

export async function fetchCertifications(): Promise<Certification[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/certifications?populate=*`);
    if (!response.ok) {
      throw new Error(`Failed to fetch certifications: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    throw error;
  }
}

export async function fetchExperience(): Promise<Experience[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/experiences?populate=*`);
    if (!response.ok) {
      throw new Error(`Failed to fetch experience: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching experience:', error);
    throw error;
  }
}