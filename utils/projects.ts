import { apiCall, fetchAPI } from './api';
import { ProjectData } from '../types/projects';

export const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    const response = await apiCall<ProjectData[]>({
      method: 'GET',
      url: '/api/projects',
      params: { populate: '*' },
    });

    if (!Array.isArray(response)) {
      console.error('Unexpected API response structure:', response);
      return [];
    }

    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchProject = async (id: string): Promise<ProjectData> => {
  const response = await apiCall<{ data: ProjectData }>({
    method: 'GET',
    url: `/api/projects/${id}`,
    params: { populate: '*' },
  });
  return response.data;
};

export async function fetchProjectById(id: string): Promise<ProjectData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}?populate=*`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Project not found');
    }
    throw new Error('Failed to fetch project');
  }

  const data = await response.json();
  return data.data;
}