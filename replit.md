# Roblox Game Joiner Application

## Overview

This is a full-stack web application built to help users join specific Roblox game instances by entering a game instance ID. The application provides a simple, user-friendly interface that constructs Roblox deep links to launch games directly from the browser.

The project follows a modern monorepo structure with a React frontend and Express.js backend, utilizing TypeScript throughout for type safety.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds
- **Component System**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build Process**: esbuild for production bundling

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Drizzle Kit for migrations
- **Development Storage**: In-memory storage implementation
- **Production Ready**: Configured for Neon Database (@neondatabase/serverless)

## Key Components

### Frontend Components
- **Home Page**: Main interface for entering game instance IDs
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Comprehensive shadcn/ui component library including buttons, inputs, cards, toasts, and modals
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Components
- **Server Setup**: Express server with TypeScript support
- **Route Registration**: Modular route system with `/api` prefix
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations
- **Error Handling**: Centralized error handling middleware

### Shared Components
- **Schema**: Shared TypeScript types and Zod schemas
- **Type Safety**: End-to-end type safety between frontend and backend

## Data Flow

1. **User Input**: User enters game instance ID in the frontend form
2. **Validation**: Client-side validation using Zod schemas
3. **URL Construction**: Application constructs Roblox deep link URL
4. **Redirection**: User is redirected to Roblox application via custom protocol handler
5. **Feedback**: Toast notifications provide user feedback for success/error states

The current implementation focuses on client-side functionality with minimal backend interaction. The backend is prepared for future expansion with user management and game instance tracking.

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool and development server

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Port**: 5000 (configured in .replit)
- **Hot Reload**: Vite HMR for frontend, tsx for backend

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Deployment**: Configured for Replit autoscale deployment
- **Command**: `npm run start`

### Database Management
- **Schema Push**: `npm run db:push` applies schema changes
- **Migrations**: Stored in `./migrations` directory
- **Connection**: Environment variable `DATABASE_URL` required

The application is optimized for deployment on Replit with PostgreSQL 16 support and autoscaling capabilities.

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Updated branding to "Freshlux Warp" with animated gradient text
- June 25, 2025. Added dynamic Place ID input field with auto-filled default value
- June 25, 2025. Implemented real-time game name fetching from Roblox API
- June 25, 2025. Added backend API endpoint for secure game information retrieval
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```