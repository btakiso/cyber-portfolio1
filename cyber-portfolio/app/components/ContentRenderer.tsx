'use client'

import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import DOMPurify from 'dompurify'

interface ContentBlock {
  type: string;
  children: Array<{
    text: string;
    bold?: boolean;
    italic?: boolean;
    children?: Array<{ text: string }>;
  }>;
  level?: number;
  language?: string;
}

interface ContentRendererProps {
  content: ContentBlock[] | string | undefined;
}

function renderContentBlock(block: ContentBlock, index: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="mb-4">
          {block.children.map((child, childIndex) => {
            let text = child.text;
            if (child.bold && child.italic) {
              return <strong key={childIndex}><em>{text}</em></strong>;
            } else if (child.bold) {
              return <strong key={childIndex}>{text}</strong>;
            } else if (child.italic) {
              return <em key={childIndex}>{text}</em>;
            }
            return <span key={childIndex}>{text}</span>;
          })}
        </p>
      );

    case 'heading':
      const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
      const headingClasses = {
        1: 'text-3xl font-bold mt-8 mb-4',
        2: 'text-2xl font-bold mt-6 mb-4',
        3: 'text-xl font-bold mt-6 mb-4',
        4: 'text-lg font-bold mt-4 mb-2',
        5: 'text-base font-bold mt-4 mb-2',
        6: 'text-sm font-bold mt-4 mb-2'
      };
      
      return (
        <HeadingTag key={index} className={headingClasses[block.level as keyof typeof headingClasses] || headingClasses[2]}>
          {block.children.map(child => child.text).join('')}
        </HeadingTag>
      );

    case 'code':
      const language = block.language || 'plaintext';
      const code = block.children.map(child => child.text).join('');
      
      return (
        <div key={index} className="code-block-wrapper my-6">
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

    case 'bulleted-list':
      return (
        <ul key={index} className="list-disc my-4 pl-5 space-y-2">
          {block.children.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-2">
              {item.children ? item.children.map(child => child.text).join('') : item.text}
            </li>
          ))}
        </ul>
      );

    case 'numbered-list':
      return (
        <ol key={index} className="list-decimal my-4 pl-5 space-y-2">
          {block.children.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-2">
              {item.children ? item.children.map(child => child.text).join('') : item.text}
            </li>
          ))}
        </ol>
      );

    default:
      return null;
  }
}

function parseStringContent(content: string): React.ReactNode {
  // Handle YouTube embeds
  const youtubeRegex = /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(?:&\S*)?/g;
  const youtubeAnchorRegex = /<a[^>]*href="(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(?:&\S*)?)"[^>]*>.*?<\/a>/g;
  
  // Replace YouTube links with React components
  let processedContent = content
    .replace(youtubeAnchorRegex, (match, url) => {
      const videoId = url.match(/v=([a-zA-Z0-9_-]+)/)?.[1];
      return videoId ? `__YOUTUBE_${videoId}__` : '';
    })
    .replace(youtubeRegex, (match, videoId) => `__YOUTUBE_${videoId}__`);

  // Sanitize HTML
  const sanitizedContent = DOMPurify.sanitize(processedContent, {
    ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'pre', 'code', 'a', 'ul', 'ol', 'li'],
    ADD_ATTR: ['class', 'language', 'href', 'target', 'rel'],
  });

  // Split content by YouTube placeholders and handle them
  const parts = sanitizedContent.split(/__YOUTUBE_([a-zA-Z0-9_-]+)__/);
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Regular content
      if (parts[i].trim()) {
        elements.push(
          <div 
            key={i}
            className="prose prose-invert prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: parts[i] }}
          />
        );
      }
    } else {
      // YouTube video ID
      const videoId = parts[i];
      elements.push(
        <div key={i} className="youtube-embed my-8">
          <iframe 
            width="100%" 
            height="400" 
            src={`https://www.youtube.com/embed/${videoId}`} 
            frameBorder="0" 
            allow="autoplay; encrypted-media" 
            allowFullScreen
          />
        </div>
      );
    }
  }

  return elements;
}

export function ContentRenderer({ content }: ContentRendererProps) {
  if (!content) return null;

  if (Array.isArray(content)) {
    return (
      <div className="prose prose-invert prose-blue max-w-none">
        {content.map((block, index) => renderContentBlock(block, index))}
      </div>
    );
  }

  if (typeof content === 'string') {
    return <div className="prose prose-invert prose-blue max-w-none">{parseStringContent(content)}</div>;
  }

  return null;
}
