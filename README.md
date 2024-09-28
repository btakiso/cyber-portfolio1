# 🛡️ CyberPortfolio

## 🌟 Project Overview

CyberPortfolio is a cutting-edge, responsive web application designed to showcase cybersecurity projects, insightful blog posts, and professional information. Built with Next.js for the frontend and Strapi as the backend CMS, this portfolio site offers a sleek, user-friendly interface for cybersecurity professionals to display their work and expertise.

### ✨ Key Features

- 🚀 Dynamic project showcase with detailed project pages
- 📝 Blog system with pagination, search, and sorting functionality
- 👤 About page with skills, certifications, and experience sections
- 📱 Responsive design for all devices
- 🌙 Dark mode UI optimized for readability
- 🖥️ Syntax highlighting for code blocks
- ⏱️ Read time calculation for blog posts
- 🖼️ Image optimization using Next.js Image component

---

## 📚 Table of Contents

1. [Technology Stack](#-technology-stack)
2. [Project Structure](#-project-structure)
3. [Key Components](#-key-components)
4. [Getting Started](#-getting-started)
5. [Development](#-development)
6. [API Integration](#-api-integration)
7. [Styling](#-styling)
8. [Deployment](#-deployment)
9. [Contributing](#-contributing)

---

## 🛠️ Technology Stack

- Frontend:
  - Next.js 14.2.10
  - React 18 (dependencies)
  - Tailwind CSS 3.4.1
- Backend:
  - Strapi (Content Management System)
  - Node.js
- Database:
  - Heroku Postgres
- Media Storage:
  - Amazon S3 (for image and file uploads)
- Styling:
  - Tailwind CSS
  - Custom CSS
- Additional libraries:
  - Axios (for API requests)
  - DOMPurify (for sanitizing HTML)
  - Lucide React (for icons)
  - React Syntax Highlighter (for code blocks)
- Deployment:
  - Frontend: Vercel
  - Backend: Heroku

This comprehensive stack enables CyberPortfolio to deliver a fast, responsive, and secure web application with efficient content management and scalable media handling.

---

## 📁 Project Structure

The project is set up as a monorepo with two main directories:

Frontend (Next.js)                 Backend (Strapi)
cyber-portfolio/                   backend/
├── app/                           ├── .strapi/
│   ├── about/                     ├── config/
│   │   └── page.tsx               │   ├── env/
│   ├── blog/                      │   ├── admin.js
│   │   ├── [id]/                  │   ├── api.js
│   │   │   └── page.tsx           │   ├── database.js
│   │   └── page.tsx               │   ├── middlewares.js
│   ├── components/                │   ├── plugins.ts
│   │   ├── about-page.tsx         │   ├── security.js
│   │   ├── AuthorBadge.tsx        │   └── server.js
│   │   ├── blog-page.tsx          ├── database/
│   │   ├── ErrorMessage.tsx       ├── node_modules/
│   │   ├── footer.tsx             ├── public/
│   │   ├── header.tsx             │   └── uploads/
│   │   ├── HeroSection.tsx        ├── src/
│   │   ├── homepage.tsx           │   ├── admin/
│   │   ├── LoadingSpinner.tsx     │   ├── api/
│   │   └── project-page.tsx       │   │   ├── about/
│   ├── fonts/                     │   │   ├── blog-post/
│   ├── projects/                  │   │   ├── certification/
│   │   ├── [id]/                  │   │   ├── experience/
│   │   │   └── page.tsx           │   │   ├── project/
│   │   └── page.tsx               │   │   └── skill/
│   ├── globals.css                │   ├── extensions/
│   ├── layout.tsx                 │   └── middlewares/
│   ├── not-found.tsx              ├── types/
│   └── page.tsx                   └── robots.txt
├── lib/
├── node_modules/
├── pages/
├── public/
├── src/
├── types/
└── utils/

---

## 🧩 Key Components

> Note: This project is currently private and not publicly accessible.

### 🏠 Homepage (`app/components/homepage.tsx`)
- Landing page component showcasing featured projects and recent blog posts.
- Utilizes `HeroSection` component for the main banner.
- Fetches and displays recent projects and blog posts.

### 💼 ProjectPage (`app/components/project-page.tsx`)
- Displays a grid of all projects with images, titles, descriptions, and tags.
- Implements pagination for browsing through multiple projects.
- Uses `LoadingSpinner` and `ErrorMessage` components for better UX during data fetching.

### 📰 BlogPage (`app/components/blog-page.tsx`)
- Lists blog posts with pagination, search, and sorting functionality.
- Calculates and displays read time for each blog post.
- Implements `AuthorBadge` component to show author information.

### 👤 AboutPage (`app/components/about-page.tsx`)
- Presents information about the portfolio owner, including skills and experience.
- Fetches and displays skills, certifications, and work experience.
- Uses `Image` component for optimized image loading of profile picture.

### 🔝 Header (`app/components/header.tsx`)
- Responsive navigation component.
- Likely includes links to main sections of the portfolio.

### 🔻 Footer (`app/components/footer.tsx`)
- Contains links to social media and additional navigation options.
- Possibly includes copyright information and other relevant links.

### 🏷️ AuthorBadge (`app/components/AuthorBadge.tsx`)
- Reusable component for displaying author information on blog posts.
- Likely includes author's name, image, and possibly a short bio or role.

### ⏳ LoadingSpinner (`app/components/LoadingSpinner.tsx`)
- Visual indicator for loading states throughout the application.
- Improves user experience during data fetching operations.

### ❗ ErrorMessage (`app/components/ErrorMessage.tsx`)
- Displays error messages when API calls or other operations fail.
- Enhances user feedback for error states.

### 🦸‍♂️ HeroSection (`app/components/HeroSection.tsx`)
- Featured section on the homepage, likely with a prominent call-to-action.
- May include animated or interactive elements to engage visitors.

### 🔧 Utility Functions
- `utils/api.ts`: Core API functionality for making requests to the Strapi backend.
- `utils/imageHelper.ts`: Handles image URL formatting for use with the Strapi backend.
- `utils/dataParser.ts`: Contains functions for parsing and formatting data (e.g., dates).
- `utils/readTime.ts`: Calculates estimated read time for blog posts.

These components and utility functions work together to create a cohesive and dynamic portfolio website. The modular structure allows for easy maintenance and future enhancements.

---

## 🔌 API Integration

The project uses custom hooks and utility functions to interact with the Strapi backend:

### Core API Functionality

- `utils/api.ts`: Provides the core API functionality using Axios.
  - `apiCall`: A generic function for making API requests with error handling.
  - `fetchAPI`: A function for fetching data from the Strapi API endpoints.

### Content-Specific API Calls

- `utils/about.ts`: Handles fetching about page data.
  - `fetchAboutData`: Retrieves the main about page content.
  - `fetchSkills`: Fetches the list of skills.
  - `fetchCertifications`: Retrieves certification information.
  - `fetchExperience`: (Implied, not shown in the provided code) Likely fetches experience data.

- `utils/blog.ts`: Manages blog-related API calls.
  - `fetchBlogPosts`: Retrieves blog post data.

- `utils/projects.ts`: Handles project-related API calls.
  - `fetchProjects`: Fetches all projects.
  - `fetchProjectById`: Retrieves a specific project by its ID.

### Environment Configuration

- The API base URL is configured using the `NEXT_PUBLIC_STRAPI_API_URL` environment variable, defaulting to 'https://api.bereketakiso.com' if not set.

### Example API Calls

Here are examples of how the API calls are structured for different content types:

1. Projects:
   ```typescript
   const fetchProjects = async (): Promise<ProjectData[]> => {
     return apiCall<ProjectData[]>({
       method: 'GET',
       url: '/api/projects',
       params: { populate: '*' },
     });
   };
   ```
   Full URL: https://api.bereketakiso.com/api/projects?populate=*

2. Blog Posts:
   ```typescript
   const fetchBlogPosts = async (): Promise<BlogPostData[]> => {
     return apiCall<BlogPostData[]>({
       method: 'GET',
       url: '/api/blog-posts',
       params: { populate: '*' },
     });
   };
   ```
   Full URL: https://api.bereketakiso.com/api/blog-posts?populate=*

3. About Page:
   ```typescript
   const fetchAboutData = async (): Promise<AboutData[]> => {
     return apiCall<AboutData[]>({
       method: 'GET',
       url: '/api/abouts',
       params: { populate: '*' },
     });
   };
   ```
   Full URL: https://api.bereketakiso.com/api/abouts?populate=*

4. Experiences:
   ```typescript
   const fetchExperiences = async (): Promise<ExperienceData[]> => {
     return apiCall<ExperienceData[]>({
       method: 'GET',
       url: '/api/experiences',
       params: { populate: '*' },
     });
   };
   ```
   Full URL: https://api.bereketakiso.com/api/experiences?populate=*

5. Skills:
   ```typescript
   const fetchSkills = async (): Promise<SkillData[]> => {
     return apiCall<SkillData[]>({
       method: 'GET',
       url: '/api/skills',
       params: { populate: '*' },
     });
   };
   ```
   Full URL: https://api.bereketakiso.com/api/skills?populate=*

6. Certifications:
   ```typescript
   const fetchCertifications = async (): Promise<CertificationData[]> => {
     return apiCall<CertificationData[]>({
       method: 'GET',
       url: '/api/certifications',
       params: { populate: '*' },
     });
   };
   ```
   Full URL: https://api.bereketakiso.com/api/certifications?populate=*

### Explanation of "?populate=*"

The `?populate=*` parameter is a query parameter used in Strapi API calls to include all related data in the response. Here's what it does:

- In Strapi, content types can have relationships with other content types (e.g., a blog post might have an author, categories, or media attachments).
- By default, these related fields are not included in the API response to keep responses lightweight.
- Adding `?populate=*` tells Strapi to include all related data for the requested content type.
- This is useful for getting complete data in a single API call, but it can make the response larger and potentially slower for complex relationships.

For example, when fetching a project with `?populate=*`, the response might include not just the project's basic fields, but also any associated images, tags, or other related content types that have been defined in the Strapi backend.

Note: While `populate=*` is convenient for development, in production you might want to be more specific about which fields to populate to optimize performance.

---

## 🎨 Styling

CyberPortfolio uses a combination of Tailwind CSS and custom styles to achieve its sleek, responsive design:

### Tailwind CSS

- Tailwind classes are applied directly in JSX for utility-first styling.
- The project uses Tailwind CSS v3.4.1 (as specified in `package.json`).
- Tailwind configuration is extended in `tailwind.config.ts` to customize the theme.

### Custom Styles

- Global styles are defined in `app/globals.css`.
- This file includes Tailwind directives and any additional custom CSS.

### Dark Mode

- The project implements a dark mode theme optimized for readability.
- Dark mode styles are likely toggled using Tailwind's dark mode feature.

### Responsive Design

- The layout is responsive and adapts to different screen sizes.
- Tailwind's responsive utilities are used to adjust styles across breakpoints.

### Component-Specific Styling

- Components like `AuthorBadge`, `about-page`, and `blog-page` may have specific styles applied.
- These styles are typically a mix of Tailwind classes and occasional custom CSS.

### Syntax Highlighting

- Code blocks in blog posts or project descriptions use syntax highlighting.
- This is likely implemented using a library like `react-syntax-highlighter`.

### Image Optimization

- The Next.js Image component is used for optimized image loading and display.
- Image handling is configured in `next.config.js` to work with the Strapi backend.

### Customizing Styles

To modify or extend the styling:

1. Use Tailwind classes directly in component JSX for most styling needs.
2. Add or modify custom styles in `app/globals.css` for global style changes.
3. Extend or override Tailwind's default configuration in `tailwind.config.ts`:
   ```typescript
   module.exports = {
     theme: {
       extend: {
         // Add custom colors, fonts, etc.
       },
     },
     variants: {
       // Add custom variants
     },
     plugins: [
       // Add Tailwind plugins
     ],
   }
   ```
4. For complex components, consider using CSS modules or styled-components if needed.

### Style Guidelines

- Maintain consistency with the existing design system.
- Prefer Tailwind utilities over custom CSS when possible.
- Use semantic class names for custom styles.
- Ensure styles are responsive and work well in both light and dark modes.

### Performance Considerations

- Tailwind's purge feature is used in production to minimize CSS file size.
- Avoid large, unused style imports that could impact load times.

By leveraging Tailwind CSS and following these guidelines, CyberPortfolio maintains a consistent, performant, and easily maintainable styling approach.

---

## 🚢 Deployment

CyberPortfolio is deployed using a combination of services to ensure optimal performance and scalability:

### Frontend Deployment (Next.js)

The frontend is deployed on Vercel, which offers seamless integration with Next.js applications:

1. Connect your GitHub repository to Vercel.
2. Configure the following environment variables in Vercel:
   - `NEXT_PUBLIC_STRAPI_API_URL`: Set to your Strapi backend URL
3. Vercel will automatically deploy your application on push to the main branch.

### Backend Deployment (Strapi)

The Strapi backend is hosted on Heroku:

1. Create a new Heroku app.
2. Connect your GitHub repository to Heroku for automatic deployments.
3. Set up the following environment variables in Heroku:
   - `DATABASE_URL`: Automatically set by Heroku Postgres add-on
   - `AWS_ACCESS_KEY_ID`: Your Amazon S3 access key
   - `AWS_ACCESS_SECRET`: Your Amazon S3 secret key
   - `AWS_BUCKET_NAME`: Your S3 bucket name
   - `AWS_REGION`: The region of your S3 bucket
4. Add the Heroku Postgres add-on to your Heroku app for the database.

### Database

- The project uses Heroku Postgres as the database for the Strapi backend.
- Heroku Postgres provides a scalable and managed PostgreSQL database.

### Media Storage

- Amazon S3 is used for storing and serving media files (images, etc.).
- Configure Strapi to use the S3 provider for file uploads.

### Deployment Process

1. Push changes to the GitHub repository.
2. Vercel will automatically deploy frontend changes.
3. Heroku will automatically deploy backend changes.

### Post-Deployment Steps

1. After deploying to Heroku, run any necessary database migrations:
   ```
   heroku run npm run strapi migrate
   ```
2. If needed, seed your database:
   ```
   heroku run npm run strapi seed
   ```

### Monitoring and Scaling

- Use Vercel's built-in analytics for frontend performance monitoring.
- Utilize Heroku's monitoring tools for backend performance.
- Scale your Heroku dyno and database as needed based on traffic.

### Security Considerations

- Ensure all environment variables are properly set and secured.
- Regularly update dependencies for both frontend and backend.
- Enable CORS settings in Strapi to allow requests only from your Vercel-deployed frontend.

By leveraging these platforms and services, CyberPortfolio achieves a robust, scalable, and easily maintainable deployment setup.

---

## 🤝 Contributing

We welcome contributions to CyberPortfolio! Here's how you can help:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Guidelines:
- Follow existing coding style and conventions
- Write clear, concise commit messages
- Update documentation as necessary
- Ensure all tests pass before submitting

> 💡 For major changes, please open an issue first to discuss your ideas.

---

## 📄 License

This project is private and proprietary. All rights reserved.

No license is granted to any party for any use, modification, or distribution of this software without explicit written permission from the owner. 
Unauthorized use, copying, or distribution is strictly prohibited.

© [Bereket Takiso] [2024]

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Strapi](https://strapi.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

Built with ❤️ by Bereket Takiso