export function calculateReadTime(content: string | undefined): number {
  if (!content) {
    return 1; // Default to 1 minute if no content
  }

  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, readTime); // Ensure minimum of 1 minute
}