'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '../../components/header'
import { fetchProjectById } from '../../../utils/projects'
import prependApiUrl from '../../../utils/imageHelper'
import { ProjectData } from '../../../types/project'
import { Calendar, ChevronLeft, Network, Code, Lock, Key } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { ContentRenderer } from '../../components/ContentRenderer'

const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' font-size='5' text-anchor='middle' alignment-baseline='middle' font-family='monospace' fill='%23333333'%3ENo Image%3C/text%3E%3C/svg%3E"

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Network, Code, Lock, Key,
  // Add more icons as needed
};


interface ContentBlock {
  type: string;
  children: Array<{
    text: string;
    bold?: boolean;
    italic?: boolean;
    children?: Array<{ text: string }>; // Add this line for list items
  }>;
  level?: number;
  language?: string;
}

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjectById(params.id);
      if (!data) {
        router.push('/404'); // Redirect to 404 page if project not found
        return;
      }
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
      setError('Failed to load project. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 text-gray-100">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner size="large" color="text-blue-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 text-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage message={error} onRetry={loadProject} />
        </div>
      </div>
    );
  }

  if (!project) return null; // This shouldn't happen, but TypeScript needs it

  const { title, image, date, tags, description, icon } = project.attributes;
  const IconComponent = icon && iconMap[icon as keyof typeof iconMap];

  // No longer need the complex formatContent function - ContentRenderer handles this properly

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      <Header />
      <div className="container mx-auto px-2 sm:px-4 py-8 pt-20 max-w-full sm:max-w-6xl">
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <main className="p-2 sm:p-4 md:p-8">
            <header className="mb-8">
              <div className="mb-8 flex justify-center">
                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={image?.data?.[0]?.attributes?.url 
                      ? prependApiUrl(image.data[0].attributes.url)
                      : placeholderImage}
                    alt={title}
                    fill
                    priority
                    quality={100}
                    style={{ objectFit: 'contain' }}
                    className="rounded-3xl bg-gray-800"
                  />
                </div>
              </div>
              <div className="flex items-center mb-4">
                {IconComponent && <IconComponent className="w-8 h-8 mr-2 text-blue-500" />}
                <h1 className="text-4xl font-bold text-blue-500">{title}</h1>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(date).toLocaleDateString()}</span>
                </div>
              </div>
              {tags?.tags && (
                <div className="flex flex-wrap gap-2">
                  {project.attributes.tags?.tags?.map((tag, index) => (
                    <span 
                      key={`${tag}-${index}`}
                      className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded-full 
                        transition-all duration-300 group-hover:bg-blue-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <article className="mb-12 text-lg">
              <div className="min-w-full overflow-hidden">
                <ContentRenderer content={description} />
              </div>
            </article>

            <nav className="flex justify-between items-center">
              <Link
                href="/projects"
                className="inline-flex items-center px-4 py-2 bg-gray-700 text-blue-400 rounded-2xl hover:bg-gray-600 transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Projects
              </Link>
            </nav>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
