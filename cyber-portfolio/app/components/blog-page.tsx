'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react'
import { Header } from './header'
import { fetchBlogPosts } from '../../utils/blog'
import prependApiUrl from '../../utils/imageHelper'
import placeholderImage from '../../public/placeholder.svg'
import { BlogPostData } from '../../types/blog'
import { calculateReadTime } from '../../utils/readTime'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return '';
  const strippedText = text.replace(/<[^>]+>/g, '');
  const decodedText = strippedText.replace(/&[#A-Za-z0-9]+;/g, (entity) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = entity;
    return textarea.value;
  });
  return decodedText.length <= maxLength ? decodedText : decodedText.slice(0, maxLength) + '...';
};

export function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Debounce search term to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBlogPosts();
      if (!data || data.length === 0) {
        setError('No blog posts found. Check back later for new content.');
        setBlogPosts([]);
      } else {
        const postsWithReadTime = data.map(post => ({
          ...post,
          attributes: {
            ...post.attributes,
            readTime: calculateReadTime(post.attributes.content || post.attributes.summary || '').toString()
          }
        }));
        setBlogPosts(postsWithReadTime);
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogPosts();
  }, [router]);

  // Memoize expensive calculations to prevent unnecessary re-renders
  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter(post => 
        post.attributes.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.attributes.summary?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.attributes.Category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a, b) => 
        sortOrder === "newest" 
          ? new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime()
          : new Date(a.attributes.date).getTime() - new Date(b.attributes.date).getTime()
      );
  }, [blogPosts, debouncedSearchTerm, sortOrder]);

  const paginationData = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    return {
      currentPosts,
      totalPages,
      indexOfFirstPost,
      indexOfLastPost
    };
  }, [filteredPosts, currentPage, postsPerPage]);

  const { currentPosts, totalPages } = paginationData;

  // Scroll to top when page changes (with smooth animation to prevent jarring)
  useEffect(() => {
    if (currentPage > 1) {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const targetPosition = mainContent.offsetTop - 100; // Account for header
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentPage]);

  // Memoized handlers to prevent unnecessary re-renders
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Page reset is handled by useEffect when debouncedSearchTerm changes
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">Cybersecurity Insights</h1>

        {/* Search and Sort */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search cybersecurity topics..."
              className="w-full bg-black/30 border-blue-500/30 text-white rounded-full py-2 px-4 pl-10 
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <select
            className="bg-black/30 border-blue-500/30 text-white rounded-full py-2 px-4 
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" color="text-blue-400" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadBlogPosts} />
        ) : blogPosts.length === 0 ? (
          <div className="text-center text-gray-300">
            No blog posts found. Check back later for new content.
          </div>
        ) : (
          <>
            {/* Featured Blog Post - Added gradient line */}
            {currentPage === 1 && filteredPosts.length > 0 && (
              <div className="mb-12 bg-black/30 border-blue-500/30 shadow-2xl shadow-blue-500/20 rounded-xl overflow-hidden">
                <div className="cyber-gradient-line" />
                <div className="flex flex-col md:flex-row h-auto">
                  <div className="w-full h-[200px] md:w-[400px] md:h-[225px] overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                    {filteredPosts[0].attributes.image && filteredPosts[0].attributes.image.data ? (
                      <Image
                        src={prependApiUrl(filteredPosts[0].attributes.image.data.attributes.url)}
                        alt={filteredPosts[0].attributes.title}
                        fill
                        style={{ 
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        className=""
                        priority
                        quality={100}
                      />
                    ) : (
                      <Image
                        src={placeholderImage}
                        alt="Placeholder"
                        fill
                        style={{ 
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        className=""
                      />
                    )}
                  </div>
                  <div className="flex-1 p-4 bg-gray-900 flex flex-col justify-center">
                    <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">
                      {filteredPosts[0].attributes.Category}
                    </div>
                    <Link href={`/blog/${filteredPosts[0].id}`} className="block mt-1 text-lg leading-tight font-medium text-white hover:underline">
                      {filteredPosts[0].attributes.title}
                    </Link>
                    <p className="mt-2 text-gray-300 line-clamp-2">
                      {truncateText(filteredPosts[0].attributes.summary, 120)}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        href={`/blog/${filteredPosts[0].id}`}
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {filteredPosts[0].attributes.readTime} min read
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Post Grid - Added gradient line to each card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <Link 
                  key={post.id}
                  href={`/blog/${post.id}`} 
                  className="block bg-black/30 border-blue-500/30 shadow-2xl shadow-blue-500/20 rounded-xl overflow-hidden 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl hover:shadow-blue-500/30 relative"
                >
                  <div className="cyber-gradient-line" />
                  <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
                    {post.attributes.image && post.attributes.image.data ? (
                      <Image
                        src={prependApiUrl(post.attributes.image.data.attributes.url)}
                        alt={post.attributes.title}
                        fill
                        style={{ 
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        className="transition-transform duration-300 group-hover:scale-105"
                        quality={100}
                      />
                    ) : (
                      <Image
                        src={placeholderImage}
                        alt="Placeholder"
                        fill
                        style={{ 
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        className=""
                      />
                    )}
                  </div>
                  <div className="p-6 bg-black/30">
                    <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold mb-1">
                      {post.attributes.Category}
                    </div>
                    <h3 className="block text-xl leading-tight font-medium text-white mb-2">
                      {post.attributes.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {truncateText(post.attributes.summary, 150)}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {post.attributes.Category}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.attributes.readTime} min read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination - Updated styling */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-l-md border border-blue-500/30 bg-black/30 text-gray-400 
                      hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 border border-blue-500/30 transition-all duration-300 ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-black/30 text-gray-400 hover:bg-blue-500/10'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-r-md border border-blue-500/30 bg-black/30 text-gray-400 
                      hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}