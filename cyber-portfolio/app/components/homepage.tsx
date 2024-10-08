'use client'

import { useState, useEffect } from 'react'
import { Network, Book, User, Lock, Code, Key, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProjects } from '../../utils/projects'
import { fetchBlogPosts } from '../../utils/blog'
import { ProjectData } from '../../types/projects'
import { BlogPostData } from '../../types/blog'
import prependApiUrl from '../../utils/imageHelper'
import DOMPurify from 'dompurify'
import { calculateReadTime } from '../../utils/readTime'
import { HeroSection } from './HeroSection'
import { fetchAboutData } from '../../utils/about'
import { AboutData } from '../../types/about'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

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

export function Homepage() {
  const [recentProjects, setRecentProjects] = useState<ProjectData[]>([])
  const [recentBlogPosts, setRecentBlogPosts] = useState<BlogPostData[]>([])
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projects, blogPosts, about] = await Promise.all([
        fetchProjects(),
        fetchBlogPosts(),
        fetchAboutData()
      ]);

      setRecentProjects(projects
        .sort((a, b) => new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime())
        .slice(0, 3)
      );

      setRecentBlogPosts(blogPosts
        .sort((a, b) => new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime())
        .slice(0, 3)
        .map(post => ({
          ...post,
          attributes: {
            ...post.attributes,
            readTime: calculateReadTime(post.attributes.content || post.attributes.summary || '').toString()
          }
        }))
      );

      setAboutData(about);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sanitizeAndTruncate = (html: string | undefined, maxLength: number) => {
    if (!html) return '';
    let text = html.replace(/&nbsp;/g, ' ');
    const sanitizedHtml = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
    text = sanitizedHtml.replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text;
  };

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

  return (
    <>
      <HeroSection />

      {/* Project Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700/20 via-gray-800/40 to-gray-900/80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Featured Projects</h2>
          {loading ? (
            <LoadingSpinner size="large" color="text-blue-400" />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadData} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentProjects.map((project) => {
                const IconComponent = project.attributes.icon && iconMap[project.attributes.icon as keyof typeof iconMap];
                const formattedContent = formatContent(project.attributes.description);
              
                return (
                  <div key={project.id} className="bg-gray-900/80 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105">
                    {project.attributes.image?.data && project.attributes.image.data.length > 0 && (
                      <Image
                        src={prependApiUrl(project.attributes.image.data[0].attributes.url)}
                        alt={project.attributes.title}
                        width={400}
                        height={200}
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        className="w-full h-48 object-cover rounded-t-xl"
                        priority={true}
                        quality={100}
                      />
                    )}
                    <div className="p-6">
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
          )}
        </div>
      </section>

      {/* Blog Update Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Latest Insights</h2>
          {loading ? (
            <LoadingSpinner size="large" color="text-blue-400" />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadData} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentBlogPosts.map((post) => (
                <div key={post.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <Image
                    src={post.attributes.image?.data 
                      ? prependApiUrl(post.attributes.image.data.attributes.url)
                      : "/placeholder.svg?height=200&width=400"}
                    width={400}
                    height={200}
                    alt={post.attributes.title}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="w-full h-40 object-cover rounded-t-xl"
                    priority={true}
                    quality={100}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{post.attributes.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {sanitizeAndTruncate(post.attributes.summary, 150)}
                    </p>
                    <div className="flex justify-between items-center">
                      <Link href={`/blog/${post.id}`} className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200">
                        Read more <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.attributes.readTime} min read
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-white text-center">
              <span className="text-white">
                About Me
              </span>
            </h2>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              {loading ? (
                <LoadingSpinner size="medium" color="text-blue-400" />
              ) : error ? (
                <ErrorMessage message={error} onRetry={loadData} />
              ) : (
                <>
                  <p className="text-xl mb-8 text-gray-300 leading-relaxed">
                    {aboutData?.attributes.Bio[0].children[0].text}
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href="/about"
                      className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                    >
                      Learn More About Me
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}