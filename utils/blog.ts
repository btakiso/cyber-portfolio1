import { apiCall } from './api';
import { BlogPostData } from '../types/blog';
import { calculateReadTime } from './readTime';

const truncateSummary = (summary: string, maxLength: number = 150): string => {
  const plainText = summary.replace(/<[^>]*>/g, '');
  if (plainText.length <= maxLength) return plainText;
  const truncated = plainText.slice(0, maxLength).split(' ').slice(0, -1).join(' ');
  return truncated + '...';
};

const formatReadTime = (minutes: number): string => {
  return `${Math.ceil(minutes)} min`;
};

export const fetchBlogPosts = async (): Promise<BlogPostData[]> => {
  try {
    const response = await apiCall<BlogPostData[]>({
      method: 'GET',
      url: '/api/blog-posts',
      params: { populate: '*' },
    });
    
    if (!Array.isArray(response)) {
      console.error('Unexpected API response structure:', response);
      return [];
    }

    return response.map(post => ({
      ...post,
      attributes: {
        ...post.attributes,
        readTime: calculateReadTime(post.attributes.content).toString()
      }
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return []; // Return an empty array instead of throwing
  }
};

export const fetchBlogPostById = async (id: string): Promise<BlogPostData | null> => {
  try {
    const response = await apiCall<BlogPostData>({
      method: 'GET',
      url: `/api/blog-posts/${id}`,
      params: { populate: '*' },
    });

    if (!response || !response.attributes) {
      console.error('Unexpected API response structure:', response);
      return null;
    }

    return {
      ...response,
      attributes: {
        ...response.attributes,
        readTime: calculateReadTime(response.attributes.content).toString()
      }
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

export async function fetchRelatedPosts(category: string, excludeId: string): Promise<BlogPostData[]> {
  try {
    const response = await apiCall<BlogPostData[]>({
      method: 'GET',
      url: '/api/blog-posts',
      params: {
        'filters[Category][$eq]': category,
        'filters[id][$ne]': excludeId,
        'pagination[limit]': 3,
        populate: '*'
      },
    });

    if (!Array.isArray(response)) {
      console.error('Unexpected API response structure:', response);
      return [];
    }

    return response.map(post => ({
      ...post,
      attributes: {
        ...post.attributes,
        readTime: calculateReadTime(post.attributes.content).toString()
      }
    }));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}