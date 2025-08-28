'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '../../components/header'
import { fetchBlogPostById, fetchRelatedPosts } from '../../../utils/blog'
import prependApiUrl from '../../../utils/imageHelper'
import { BlogPostData } from '../../../types/blog'
import { Clock, Calendar, Facebook, Linkedin, ChevronLeft } from 'lucide-react'
import { calculateReadTime } from '@/utils/readTime'
import AuthorBadge from '../../components/AuthorBadge'
import { ContentRenderer } from '../../components/ContentRenderer'

const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' font-size='5' text-anchor='middle' alignment-baseline='middle' font-family='monospace' fill='%23333333'%3ENo Image%3C/text%3E%3C/svg%3E"

// XLogo component
const XLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <g>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </g>
  </svg>
);

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const loadBlogPost = async () => {
      try {
        const data = await fetchBlogPostById(params.id);
        if (!data) throw new Error('Blog post not found');

        const content = data.attributes.content || data.attributes.summary || '';
        const readTime = calculateReadTime(content);

        const postWithReadTime: BlogPostData = {
          ...data,
          attributes: {
            ...data.attributes,
            readTime: readTime.toString()
          }
        };
        setBlogPost(postWithReadTime);

        const related = await fetchRelatedPosts(data.attributes.Category || '', params.id);
        setRelatedPosts(related);
      } catch (error) {
        console.error('Failed to load blog post:', error);
        if (error instanceof Error && error.message === 'Blog post not found') {
          router.push('/404');
        } else {
          setError('Failed to load blog post. Please try again later.');
        }
      }
    };

    loadBlogPost();
  }, [params.id, router]);

  if (!isClient) return null;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!blogPost) return <div>Loading...</div>;

  const { title, image, date, readTime, Category, summary, content } = blogPost.attributes;

  // No longer need the complex formatContent function - ContentRenderer handles this properly

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareOnX = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedShareUrl}&text=${encodedTitle}`, '_blank');
  };

  return (
    <div className="bg-gray-800 text-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto px-0 sm:px-6 lg:px-8 py-8 pt-20 w-full">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <main className="p-4 sm:p-6 lg:p-8">
            {/* Header and Introduction */}
            <header className="mb-8">
              <div className="mb-8">
                <div className="relative w-full h-48 sm:h-64 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={image?.data 
                      ? prependApiUrl(image.data.attributes.url)
                      : placeholderImage}
                    alt={title}
                    fill
                    priority
                    quality={100}
                    style={{ objectFit: 'cover' }}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-blue-500">{title}</h1>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                <div>
                  <div className="flex items-center text-gray-200 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="mr-4">{new Date(date).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{readTime} min read</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200">Category:</span>
                    <span className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {Category}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <AuthorBadge />
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-gray-200">Share:</span>
                <button 
                  onClick={shareOnX}
                  className="text-blue-400 hover:text-blue-300" 
                  aria-label="Share on X (formerly Twitter)"
                >
                  <XLogo className="w-5 h-5 fill-current" />
                </button>
                <button 
                  onClick={shareOnFacebook}
                  className="text-blue-400 hover:text-blue-300" 
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={shareOnLinkedIn}
                  className="text-blue-400 hover:text-blue-300" 
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Summary Section */}
            {summary && (
              <div className="mb-8 bg-gray-800 p-4 sm:p-6 rounded-xl">
                <ContentRenderer content={summary} />
              </div>
            )}

            {/* Content Section */}
            <article className="mb-12 text-base sm:text-lg">
              <ContentRenderer content={content} />
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mb-12">
                <h3 className="text-xl sm:text-2xl font-semibold mb-6">Related Posts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                      <div className="bg-gray-700 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                        <div className="relative h-[240px]">
                          <Image
                            src={post.attributes.image?.data 
                              ? prependApiUrl(post.attributes.image.data.attributes.url)
                              : placeholderImage}
                            alt={post.attributes.title}
                            fill
                            style={{ 
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                            className="rounded-t-xl"
                            quality={100}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                            {post.attributes.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Navigation */}
            <nav className="flex justify-between items-center">
              <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 bg-gray-700 text-blue-400 rounded-2xl hover:bg-gray-600 transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Blog
              </Link>
            </nav>
          </main>
        </div>
      </div>
    </div>
  );
}
