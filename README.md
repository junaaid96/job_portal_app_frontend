# Job Portal App Frontend

## Features

- View all job postings
- Search jobs by keyword
- Detailed view of individual job posts
- Add new job postings
- Edit existing job postings
- Delete job postings
- Responsive design for mobile and desktop

## Tech Stack

- [Next.js](https://nextjs.org) - React framework for production
- [Tailwind CSS](https://tailwindcss.com) - For styling
- [Geist Font](https://vercel.com/font) - Modern typography
- REST API integration

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/yourusername/job_portal_app_frontend.git
cd job_portal_app_frontend
```

Install the dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## API Integration

This frontend connects to a Spring Boot backend with the following endpoints:

- `GET /jobPosts` - Fetch all job posts
- `GET /jobPost/{postId}` - Fetch specific job post
- `POST /jobPost` - Create new job post
- `PUT /jobPost` - Update existing job post
- `DELETE /jobPost/{postId}` - Delete job post
- `GET /jobPosts/search/{keyword}` - Search job posts
