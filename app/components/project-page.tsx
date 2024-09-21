'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, Network, Code, Lock, Key } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { fetchProjects } from '../../utils/projects'
import { ProjectData } from '../../types/projects'
import { Header } from './header'
import prependApiUrl from '../../utils/imageHelper'
import DOMPurify from 'dompurify'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import { notFound } from 'next/navigation'

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
  }>;
  level?: number;
  language?: string;
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const router = useRouter();

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjects();
      if (!data || data.length === 0) {
        notFound(); // This will trigger the not-found page
        return;
      }
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const sortedProjects = [...projects].sort((a, b) => 
    sortOrder === "newest" 
      ? new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime()
      : new Date(a.attributes.createdAt).getTime() - new Date(b.attributes.createdAt).getTime()
  );

  const formatContent = (content: ProjectData['attributes']['description']) => {
    if (!content) return null;
    let htmlContent = '';

    if (Array.isArray(content)) {
      htmlContent = content.map((block: ContentBlock) => {
        switch (block.type) {
          case 'paragraph':
            return `<p>${block.children.map(child => {
              let text = child.text;
              if (child.bold) text = `<strong>${text}</strong>`;
              if (child.italic) text = `<em>${text}</em>`;
              return text;
            }).join('')}</p>`;
          case 'heading':
            return block.level ? `<h${block.level}>${block.children.map(child => child.text).join('')}</h${block.level}>` : '';
          case 'code':
            return `<pre><code class="language-${block.language || 'plaintext'}">${block.children.map(child => child.text).join('')}</code></pre>`;
          default:
            return '';
        }
      }).join('');
    } else if (typeof content === 'string') {
      htmlContent = content;
    } else {
      console.error('Unexpected content format:', content);
      return null;
    }

    return DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'pre', 'code'],
      ADD_ATTR: ['class', 'language'],
    });
  };

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
          <ErrorMessage message={error} onRetry={loadProjects} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      <Header />
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Featured Projects</h1>
          
          {/* Add sorting dropdown */}
          <div className="mb-8 flex justify-end">
            <select
              className="bg-gray-900 text-white border border-gray-700 rounded-full py-2 px-4 focus:outline-none focus:border-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProjects.map((project) => {
              const IconComponent = project.attributes.icon && iconMap[project.attributes.icon as keyof typeof iconMap];
              const formattedContent = formatContent(project.attributes.description);
              
              return (
                <div key={project.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                  <Image
                    src={project.attributes.image?.data && project.attributes.image.data.length > 0
                      ? prependApiUrl(project.attributes.image.data[0].attributes.url)
                      : `/placeholder.svg?height=200&width=400&text=Project+${project.id}`}
                    alt={project.attributes.title || `Project ${project.id} thumbnail`}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-xl"
                    priority
                  />
                  <div className="p-6 bg-gray-900">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{project.attributes.title}</h3>
                      {IconComponent && <IconComponent className="w-8 h-8 text-blue-400" />}
                    </div>
                    {formattedContent && (
                      <div 
                        className="text-gray-300 mb-4 line-clamp-3 prose prose-sm prose-invert"
                        dangerouslySetInnerHTML={{ __html: formattedContent }}
                      />
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.attributes.tags && typeof project.attributes.tags === 'object' && 'tag' in project.attributes.tags && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {project.attributes.tags.tag}
                        </span>
                      )}
                    </div>
                    <Link href={`/projects/${project.id}`} className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200">
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}