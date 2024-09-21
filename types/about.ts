export interface AboutData {
  id: number;
  attributes: {
    name: string;
    Bio: {
      type: string;
      children: {
        type: string;
        text: string;
      }[];
    }[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    profile_picture: {
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
      };
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

export interface Skill {
  id: number;
  attributes: {
    Technical_Skills: SkillItem[];
    Analytical_Skills: SkillItem[];
    Communication_Skills: SkillItem[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

interface SkillItem {
  type: string;
  format: string;
  children: {
    type: string;
    children: {
      type: string;
      text: string;
    }[];
  }[];
}

export interface Certification {
  id: number;
  attributes: {
    Name: string;
    Organization: string;
    Issued: string;
    Show_Credential: string; // Add this line if it's not already present
    logo: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export interface Experience {
  id: number;
  attributes: {
    title: string;
    company: string;
    duration: string;
    description: {
      type: string;
      format: string;
      children: {
        type: string;
        children: {
          type: string;
          text: string;
        }[];
      }[];
    }[];
  };
}