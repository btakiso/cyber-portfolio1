export interface ProjectData {
  id: number;
  attributes: {
    title: string;
    image: {
      data: Array<{
        attributes: {
          url: string;
        };
      }>;
    };
    date: string;
    tags: {
      tag: string;
    };
    description: string | Array<{
      type: string;
      children: Array<{
        text: string;
      }>;
      language?: string;
    }>;
    icon?: string;  // Add this line
  };
}