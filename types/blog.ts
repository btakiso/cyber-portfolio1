export interface BlogPostData {
  id: number;
  attributes: {
    title: string;
    content?: string;  // Make content optional
    summary?: string;  // Add this line
    date: string;
    readTime: string;
    Category: string;
    image?: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    // ... other properties
  };
}

interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}