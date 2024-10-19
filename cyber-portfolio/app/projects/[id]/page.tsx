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
import DOMPurify from 'dompurify'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { createRoot } from 'react-dom/client'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'

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
          case 'bulleted-list':
            return `<ul>${block.children.map(item => `<li>${item.children ? item.children.map(child => child.text).join('') : item.text}</li>`).join('')}</ul>`;
          case 'numbered-list':
            return `<ol>${block.children.map(item => `<li>${item.children ? item.children.map(child => child.text).join('') : item.text}</li>`).join('')}</ol>`;
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

    const sanitizedContent = DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'pre', 'code', 'a', 'ul', 'ol', 'li'],
      ADD_ATTR: ['class', 'language', 'href', 'target', 'rel'],
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, 'text/html');

    const codeBlocks = doc.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const code = block.textContent || '';
      const language = block.className.replace('language-', '') || 'text';
      
      const mountPoint = document.createElement('div');
      mountPoint.className = 'code-block-mount-point';
      mountPoint.dataset.code = code;
      mountPoint.dataset.language = language;
      block.parentNode?.parentNode?.replaceChild(mountPoint, block.parentNode);
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

    // Process tables
    const tables = doc.querySelectorAll('table');
    tables.forEach((table) => {
      table.classList.add('w-full', 'text-sm', 'border-collapse');
      const wrapper = document.createElement('div');
      wrapper.classList.add('overflow-x-auto', 'my-4', 'relative', 'w-full', '-mx-2', 'sm:-mx-4');
      
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);

      // Set table to full width
      (table as HTMLTableElement).style.width = '100%';

      // Adjust cell styling
      const cells = table.querySelectorAll('th, td');
      cells.forEach((cell) => {
        (cell as HTMLTableCellElement).style.minWidth = '100px';
        cell.classList.add('px-2', 'py-2', 'border', 'border-gray-700', 'break-words');
      });

      // Add horizontal scroll indicator
      const scrollIndicator = document.createElement('div');
      scrollIndicator.classList.add('h-1', 'bg-gray-700', 'mt-2', 'rounded-full');
      const scrollThumb = document.createElement('div');
      scrollThumb.classList.add('h-full', 'bg-blue-500', 'rounded-full', 'transition-all', 'duration-300', 'ease-in-out');
      scrollIndicator.appendChild(scrollThumb);
      wrapper.appendChild(scrollIndicator);

      // Add scroll event listener
      wrapper.addEventListener('scroll', () => {
        const scrollPercentage = (wrapper.scrollLeft / (wrapper.scrollWidth - wrapper.clientWidth)) * 100;
        scrollThumb.style.width = `${Math.max(10, scrollPercentage)}%`;
        scrollThumb.style.marginLeft = `${scrollPercentage}%`;
      });

      // Initial setup of scroll thumb
      const scrollPercentage = (wrapper.clientWidth / wrapper.scrollWidth) * 100;
      scrollThumb.style.width = `${Math.max(10, scrollPercentage)}%`;
    });

    const tableHeaders = doc.querySelectorAll('th');
    tableHeaders.forEach((header) => {
      header.classList.add('bg-gray-800', 'text-left', 'text-xs', 'font-medium', 'text-gray-300', 'uppercase', 'tracking-wider', 'sticky', 'top-0');
    });

    const tableCells = doc.querySelectorAll('td');
    tableCells.forEach((cell) => {
      cell.classList.add('text-sm', 'text-gray-200');
    });

    return (
      <div
        className="prose prose-invert prose-blue max-w-none"
        dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
        ref={(el) => {
          if (el) {
            el.querySelectorAll('.code-block-mount-point').forEach((mountPoint) => {
              const code = mountPoint.getAttribute('data-code') || '';
              const language = mountPoint.getAttribute('data-language') || 'text';
              const root = createRoot(mountPoint);
              root.render(
                <div className="code-block-wrapper my-4">
                  <div className="code-block-header bg-gray-700 text-gray-300 px-4 py-2 rounded-t-lg">
                    <span className="font-mono text-sm">{language}</span>
                  </div>
                  <SyntaxHighlighter
                    language={language}
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
                    style={{ objectFit: 'cover' }}
                    className="rounded-3xl"
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
              {tags && tags.tag && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">Tags:</span>
                  <span className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {tags.tag}
                  </span>
                </div>
              )}
            </header>

            <article className="mb-12 text-lg">
              <div className="min-w-full overflow-hidden">
                {formatContent(description)}
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
