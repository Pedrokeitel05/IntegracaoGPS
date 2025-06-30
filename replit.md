# GPS Group Onboarding Platform

## Overview

This is a comprehensive employee onboarding platform built for GPS Group, designed to streamline the integration process for new employees across different job positions and companies within the organization. The platform provides a modular training system with role-specific content, progress tracking, and administrative management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with local storage persistence
- **UI Components**: Radix UI primitives for accessibility

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage (current implementation)
- **Development**: Hot reload with Vite middleware integration

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage abstraction
│   └── vite.ts             # Development server setup
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Database schema definitions
└── migrations/             # Database migration files
```

## Key Components

### Onboarding Flow
1. **Welcome Screen**: Initial landing page with company branding
2. **Registration Form**: Employee data collection with validation
3. **Module Navigation**: Visual progress tracking and module selection
4. **Module Content**: Interactive training content with video support
5. **Admin Panel**: Content management for administrators

### Module System
- **Sequential Learning**: Modules unlock based on completion of prerequisites
- **Role-Based Content**: Different modules available based on job position
- **Progress Tracking**: Real-time completion status and progress indicators
- **Multimedia Support**: Video content integration with YouTube embedding

### User Management
- **Employee Profiles**: Complete registration with CPF, job position, and company
- **Progress Persistence**: Local storage for maintaining user state
- **Role-Specific Modules**: Tailored content based on employee function

## Data Flow

1. **User Registration**: Employee completes registration form → Data stored locally
2. **Module Initialization**: System loads appropriate modules based on job position
3. **Content Delivery**: Modules served sequentially with completion tracking
4. **Progress Updates**: Completion status updated in real-time
5. **Administrative Oversight**: Admins can edit module content and track progress

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with extensive Radix UI component library
- **Styling**: Tailwind CSS with custom design system
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state management
- **Utilities**: Class variance authority, clsx, date-fns

### Backend Dependencies
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Session Management**: Connect-pg-simple for PostgreSQL sessions
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin and custom error handling
- **Code Quality**: TypeScript with strict configuration
- **Database Management**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with Express middleware
- **Database**: PostgreSQL connection via environment variables
- **Static Assets**: Served through Vite in development mode

### Production Build
- **Frontend**: Vite build with optimized bundles
- **Backend**: esbuild compilation to ESM format
- **Database**: Drizzle migrations for schema deployment
- **Static Serving**: Express serves built frontend assets

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Build Scripts**: Separate development and production configurations
- **Asset Handling**: Proper path resolution for static files

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 30, 2025: Initial setup
- June 30, 2025: Implemented real-time synchronization with WebSocket
- June 30, 2025: Added scroll-to-top functionality for admin edits
- June 30, 2025: Completed mobile optimization with responsive design
- June 30, 2025: Applied modules to all work areas automatically
- June 30, 2025: Enhanced fullscreen functionality with cross-browser support