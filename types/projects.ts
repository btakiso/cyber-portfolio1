export interface ProjectData {
  id: number;
  attributes: {
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    description: {
      type: string;
      children: {
        type: string;
        text: string;
      }[];
    }[];
    date: string;
    icon: string;
    tags: {
      tag: string;
    };
    projectId: string;
    markdown: string;
    image: {
      data: {
        id: number;
        attributes: {
          name: string;
          alternativeText: string | null;
          caption: string | null;
          width: number;
          height: number;
          formats: {
            thumbnail: ImageFormat;
            small: ImageFormat;
            medium: ImageFormat;
          };
          hash: string;
          ext: string;
          mime: string;
          size: number;
          url: string;
          previewUrl: string | null;
          provider: string;
          provider_metadata: any | null;
          createdAt: string;
          updatedAt: string;
        };
      }[];
    };
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