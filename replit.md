# Overview

This is a dog training educational application built with React, TypeScript, Express.js, and PostgreSQL. The app gamifies dog training education through interactive lessons, progress tracking, achievements, and XP-based progression. Users learn dog training commands and techniques through various exercise types including drag-and-drop, multiple choice, and audio pronunciation exercises.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Wouter** for client-side routing instead of React Router
- **TanStack Query** for server state management and API caching
- **Tailwind CSS** with **shadcn/ui** components for styling and UI elements
- **Vite** as the build tool and development server

## Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with routes for users, lessons, exercises, progress, and achievements
- **In-memory storage** implementation with interface-based design for easy database swapping
- **Middleware** for request logging and error handling

## Database Schema
The application uses **Drizzle ORM** with PostgreSQL, featuring these main entities:
- **Users**: Store user profiles with username, email, dog name, streak, and total XP
- **Lessons**: Organized training content with difficulty levels and categories
- **Exercises**: Individual training activities within lessons (drag-drop, multiple choice, audio)
- **User Progress**: Track completion status, scores, and attempts per lesson
- **Achievements**: Unlockable rewards with XP values
- **User Achievements**: Junction table for tracking unlocked achievements

## Component Architecture
- **Page components** for main routes (Home, Lesson, Achievements, Progress, Profile)
- **Reusable UI components** using shadcn/ui design system
- **Specialized components** for different exercise types (DragDropExercise, AudioButton)
- **Custom hooks** for audio playback, drag-and-drop functionality, and mobile detection

## State Management
- **TanStack Query** for server state with automatic caching and background updates
- **React hooks** for local component state
- **Custom hooks** for shared logic (useAudio, useDragDrop, useToast)

## Styling System
- **Tailwind CSS** with custom color palette themed around dog training
- **CSS custom properties** for consistent theming
- **shadcn/ui** component library for consistent design patterns
- **Responsive design** with mobile-first approach

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for Neon
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM and migration tools
- **connect-pg-simple**: PostgreSQL session store for Express

## UI and Styling
- **@radix-ui/react-*** : Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: For component variant management
- **lucide-react**: Icon library

## Development Tools
- **typescript**: Type safety
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Additional Libraries
- **wouter**: Lightweight client-side routing
- **@tanstack/react-query**: Server state management
- **date-fns**: Date manipulation utilities
- **embla-carousel-react**: Carousel component
- **cmdk**: Command palette functionality