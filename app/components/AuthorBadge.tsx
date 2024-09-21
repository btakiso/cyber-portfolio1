import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAboutData } from '../../utils/about';
import prependApiUrl from '../../utils/imageHelper';
import { Linkedin } from 'lucide-react';

interface AboutData {
  id: number;
  attributes: {
    name: string;
    Bio: { type: string; children: { type: string; text: string; }[]; }[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    profile_picture: {
      data: {
        id: number;
        attributes: {
          url: string;
          // Add other necessary fields here
        };
      };
    };
  };
}

const AuthorBadge: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const linkedInUrl = "https://www.linkedin.com/in/bereket-takiso/";

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await fetchAboutData();
        setAboutData(data);
      } catch (error) {
        console.error('Failed to load about data:', error);
      }
    };

    loadAboutData();
  }, []);

  if (!aboutData) {
    return null; // or a loading spinner
  }

  const { name, profile_picture } = aboutData.attributes;

  return (
    <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto border border-gray-600">
      <div className="relative">
        <Image
          src={profile_picture?.data 
            ? prependApiUrl(profile_picture.data.attributes.url)
            : '/placeholder-profile.jpg'}
          alt={name}
          width={70}
          height={70}
          className="rounded-full border-2 border-blue-400 shadow-md"
        />
        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="ml-4 flex-grow">
        <Link 
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-blue-300 hover:text-blue-200 transition-colors duration-200"
        >
          {name}
        </Link>
        <p className="text-sm text-gray-200">Author</p>
        <Link 
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          <Linkedin className="w-4 h-4 mr-1" />
          <span className="text-sm">Connect</span>
        </Link>
      </div>
    </div>
  );
};

export default AuthorBadge;