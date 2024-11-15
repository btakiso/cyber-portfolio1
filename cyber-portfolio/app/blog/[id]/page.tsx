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
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { createRoot } from 'react-dom/client'
import DOMPurify from 'dompurify'
import { calculateReadTime } from '@/utils/readTime'
import AuthorBadge from '../../components/AuthorBadge'

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

  const formatContent = (content: string | undefined) => {
    if (!content) return null;

    const youtubeRegex = /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(?:&\S*)?/g;
    const youtubeAnchorRegex = /<a[^>]*href="(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(?:&\S*)?)"[^>]*>.*?<\/a>/g;
    
    // Replace YouTube links with placeholders
    const contentWithPlaceholders = content
      .replace(youtubeAnchorRegex, (match, url) => {
        const videoId = url.match(/v=([a-zA-Z0-9_-]+)/)?.[1];
        return videoId ? `__YOUTUBE_${videoId}__` : '';
      })
      .replace(youtubeRegex, (match, videoId) => `__YOUTUBE_${videoId}__`);

    // Sanitize the HTML content
    const sanitizedContent = DOMPurify.sanitize(contentWithPlaceholders, {
      ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'pre', 'code', 'a', 'ul', 'ol', 'li'],
      ADD_ATTR: ['class', 'language', 'href', 'target', 'rel'],
    });

    // Parse the sanitized content
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, 'text/html');

    // Process code blocks
    const codeBlocks = doc.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const code = block.textContent || '';
      const languageClasses = block.className.split(' ').filter(cls => cls.startsWith('language-'));
      const languages = languageClasses.map(cls => cls.replace('language-', '')).join(', ') || 'plaintext';
      
      // Replace the original pre element with a div that we'll use as a mounting point
      const mountPoint = document.createElement('div');
      mountPoint.className = 'code-block-mount-point';
      mountPoint.dataset.code = code;
      mountPoint.dataset.languages = languages;
      block.parentNode?.parentNode?.replaceChild(mountPoint, block.parentNode);
    });

    // Replace YouTube placeholders
    const youtubeEmbeds = doc.querySelectorAll('p');
    youtubeEmbeds.forEach((p) => {
      const match = p.textContent?.match(/__YOUTUBE_([a-zA-Z0-9_-]+)__/);
      if (match) {
        const videoId = match[1];
        const embed = document.createElement('div');
        embed.className = 'youtube-embed my-8'; // Increased vertical margin
        embed.innerHTML = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`; // Increased height to 400px
        p.parentNode?.replaceChild(embed, p);
      }
    });

    // Process hyperlinks
    const links = doc.querySelectorAll('a');
    links.forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.classList.add('text-blue-400', 'hover:text-blue-300', 'underline');
    });

    // Process lists
    const lists = doc.querySelectorAll('ul, ol');
    lists.forEach((list) => {
      list.classList.add('my-4', 'pl-5', 'space-y-2');
      if (list.tagName === 'OL') {
        list.classList.add('list-decimal');
      } else {
        list.classList.add('list-disc');
      }
    });

    const listItems = doc.querySelectorAll('li');
    listItems.forEach((item) => {
      item.classList.add('pl-2');
    });

    // Process headings
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      heading.classList.add('font-bold', 'mt-6', 'mb-4');
      switch (heading.tagName) {
        case 'H1':
          heading.classList.add('text-3xl');
          break;
        case 'H2':
          heading.classList.add('text-2xl');
          break;
        case 'H3':
          heading.classList.add('text-xl');
          break;
        default:
          heading.classList.add('text-lg');
      }
    });

    // Return the modified content
    return (
      <div
        className="prose prose-invert prose-blue max-w-none"
        dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
        ref={(el) => {
          if (el) {
            el.querySelectorAll('.code-block-mount-point').forEach((mountPoint) => {
              const code = mountPoint.getAttribute('data-code') || '';
              const languages = mountPoint.getAttribute('data-languages') || 'plaintext';
              const root = createRoot(mountPoint);
              root.render(
                <div className="code-block-wrapper my-4">
                  <div className="code-block-header bg-gray-700 text-gray-300 px-4 py-2 rounded-t-lg flex justify-between items-center">
                    <span className="font-mono text-sm">{languages}</span>
                    <button className="copy-button text-sm bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded">Copy</button>
                  </div>
                  <SyntaxHighlighter
                    language={languages.split(', ')[0]} // Use the first language for highlighting
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0 0 0.5rem 0.5rem',
                      padding: '1rem',
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            });
          }
        }}
      />
    );
  };

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
                {formatContent(summary)}
              </div>
            )}

            {/* Content Section */}
            <article className="prose prose-invert prose-blue max-w-none mb-12 text-base sm:text-lg">
              {formatContent(content)}
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mb-12">
                <h3 className="text-xl sm:text-2xl font-semibold mb-6">Related Posts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                      <div className="bg-gray-700 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                        <Image
                          src={post.attributes.image?.data 
                            ? prependApiUrl(post.attributes.image.data.attributes.url)
                            : placeholderImage}
                          alt={post.attributes.title}
                          width={300}
                          height={200}
                          className="w-full h-48 sm:h-56 object-cover"
                          quality={100}
                        />
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
