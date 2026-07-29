# Portfolio — Ibrahim Saeed

A modern, interactive portfolio built with React, TypeScript, and Tailwind CSS. Features dark mode, glassmorphism UI, smooth animations, custom cursor, particle effects, and a working contact form with email integration.

## Tech Stack

- **React 19** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS v4** (styling)
- **Motion** (animations)
- **Lucide React** (icons)
- **React Router DOM** (routing)
- **Express + Nodemailer** (contact form backend)

## Features

- Dark theme with glassmorphism design
- Custom cursor and particle background
- Smooth scroll animations (Reveal on scroll)
- Responsive layout (mobile-first)
- Working contact form (sends email via Gmail SMTP)
- Project showcase with tags, type badges, and GitHub links
- About section with stats and skill bars
- Experience timeline
- Fully accessible

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (Vite on port 3000, API server on port 3001)
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```
