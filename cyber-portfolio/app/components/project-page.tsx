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
          <h1 className="text-4xl font-bold text-blue-500 mb-8 text-center">Featured Projects</h1>
          
          {/* Updated sorting dropdown styling */}
          <div className="mb-8 flex justify-end">
            <select
              className="bg-black/30 border-blue-500/30 text-white rounded-full py-2 px-4 
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 
                transition-all duration-300"
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
                <Link 
                  href={`/projects/${project.id}`} 
                  className="group block bg-black/30 border-blue-500/30 shadow-2xl shadow-blue-500/20 
                    rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 
                    hover:shadow-3xl hover:shadow-blue-500/30 relative"
                >
                  <div className="cyber-gradient-line" />
                  <div className="relative">
                    <Image
                      src={project.attributes.image?.data && project.attributes.image.data.length > 0
                        ? prependApiUrl(project.attributes.image.data[0].attributes.url)
                        : `/placeholder.svg?height=200&width=400&text=Project+${project.id}`}
                      alt={project.attributes.title || `Project ${project.id} thumbnail`}
                      width={400}
                      height={200}
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 
                        group-hover:scale-105"
                      priority
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 bg-black/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 
                        transition-colors duration-300">
                        {project.attributes.title}
                      </h3>
                      {IconComponent && (
                        <IconComponent className="w-8 h-8 text-blue-400 transform transition-all 
                          duration-300 group-hover:scale-110 group-hover:rotate-3" />
                      )}
                    </div>
                    {formattedContent && (
                      <div 
                        className="text-gray-300 mb-4 line-clamp-3 prose prose-sm prose-invert 
                          transition-all duration-300 group-hover:text-gray-100"
                        dangerouslySetInnerHTML={{ __html: formattedContent }}
                      />
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.attributes.tags?.tags?.map((tag: string, index: number) => (
                        <span 
                          key={`${tag}-${index}`}
                          className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded-full 
                            transition-all duration-300 group-hover:bg-blue-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-blue-400 opacity-0 transform 
                      translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all 
                      duration-300">
                      <span className="mr-2">View Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}