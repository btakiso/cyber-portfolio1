# 🛡️ CyberPortfolio

## 🌟 Project Overview

CyberPortfolio is a cutting-edge, responsive web application designed to showcase cybersecurity projects, insightful blog posts, and professional information. Built with Next.js for the frontend and Strapi as the backend CMS, this portfolio site offers a sleek, user-friendly interface for cybersecurity professionals to display their work and expertise.

### ✨ Key Features

- 🚀 Dynamic project showcase
- 📝 Blog with categorized posts
- 👤 About page with skills and experience
- 📱 Responsive design for all devices
- 🌙 Dark mode UI optimized for readability

---

## 📚 Table of Contents

1. [Getting Started](#-getting-started)
2. [Project Structure](#-project-structure)
3. [Key Components](#-key-components)
4. [API Integration](#-api-integration)
5. [Styling](#-styling)
6. [Deployment](#-deployment)
7. [Contributing](#-contributing)

---

## 🚀 Getting Started

To set up the project locally, follow these steps: 

Clone the repository
git clone https://github.com/yourusername/cyber-portfolio.git

Navigate to the project directory
cd cyber-portfolio

Install dependencies
npm install

Set up environment variables
cp .env.example .env.local

Edit .env.local with your Strapi backend URL and any other necessary variables

Run the development server
npm run dev

For the Strapi backend:

bash

Navigate to the backend directory
cd backend

Install dependencies
npm install

Start the Strapi server
npm run develop

> 📌 **Note:** Ensure you have Node.js (v14 or later) and npm installed on your system.

---

## 📁 Project Structure

CYBER-PORTFOLIO/
│
├── app/
│ ├── about/
│ ├── blog/
│ ├── projects/
│ ├── components/
│ ├── layout.tsx
│ └── page.tsx
├── public/
├── types/
├── utils/
├── .env.local
├── next.config.js
├── package.json
└── tsconfig.json

- `app/`: Main pages and components
- `public/`: Static assets
- `types/`: TypeScript type definitions
- `utils/`: Utility functions for API calls and data processing
- `next.config.js`: Next.js configuration
- `tsconfig.json`: TypeScript configuration

---

## 🧩 Key Components

### 🏠 Homepage (`app/page.tsx`)
Landing page showcasing featured projects and recent blog posts.

### 💼 ProjectPage (`app/projects/page.tsx`)
Grid display of all projects with images, titles, descriptions, and tags.

### 📰 BlogPage (`app/blog/page.tsx`)
Blog post listing with pagination, search, and sorting functionality.

### 👤 AboutPage (`app/about/page.tsx`)
Information about the portfolio owner, including skills and experience.

### 🔝 Header (`app/components/Header.tsx`)
Responsive navigation component.

### 🔻 Footer (`app/components/Footer.tsx`)
Links to social media and additional navigation.

---

## 🔌 API Integration

Custom hooks and utility functions interact with the Strapi backend:

- `utils/api.ts`: Base `apiCall` function using Axios
- `utils/about.ts`, `utils/blog.ts`, `utils/projects.ts`: Content-specific API calls

Example API call:

typescript
export const fetchBlogPosts = async (): Promise<BlogPostData[]> => {
return apiCall<BlogPostData[]>({
method: 'GET',
url: '/api/blog-posts',
params: { populate: '' },
});
};

---

## 🎨 Styling

The project utilizes Tailwind CSS for a utility-first design approach:

- Tailwind classes applied directly in JSX
- Custom styles in `app/globals.css`
- Dark theme optimized for readability

To modify styles:
1. Use Tailwind classes in components
2. Add custom styles to `app/globals.css`
3. Extend Tailwind config in `tailwind.config.js` as needed

---

## 🚢 Deployment

Easily deploy to platforms like Vercel or Netlify:

1. Connect your GitHub repository
2. Set up environment variables
3. Deploy the application

For the Strapi backend, consider platforms like Heroku or DigitalOcean.

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

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Strapi](https://strapi.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

Built with ❤️ by Bek