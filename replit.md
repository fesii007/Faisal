# Advanced Sci-Fi Portfolio Website

## Overview

This is a premium sci-fi-themed personal portfolio website for Faisal Hanif, a digital craftsman specializing in web development, video editing, and AI solutions. The project combines a modern React frontend with an Express.js backend, featuring cutting-edge visual effects including particle systems, glass morphism design, and futuristic animations. The portfolio showcases professional services through an immersive cyberpunk aesthetic with interactive elements and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using React with TypeScript and modern UI patterns:
- **React Framework**: Uses React 18 with functional components and hooks for component-based architecture
- **Routing**: Wouter library for lightweight client-side routing without heavy framework overhead
- **Styling**: Tailwind CSS with extensive custom sci-fi theme variables, animations, and glass morphism effects
- **Component Library**: Radix UI components with shadcn/ui styling system for accessible, customizable components
- **State Management**: TanStack Query for server state management and local React state for UI interactions
- **Build Tool**: Vite for fast development server and optimized production builds with hot module replacement

### Backend Architecture
Simple Express.js server with extensible patterns:
- **Framework**: Express.js with TypeScript for type safety and modern JavaScript features
- **Architecture**: Modular route registration system with abstract storage interface for future extensibility
- **Storage Interface**: Abstract storage layer with in-memory implementation, designed for easy database integration
- **Development**: Integrated with Vite development server for seamless full-stack development experience

### Visual Effects System
Advanced particle system and animation architecture:
- **Particle Engine**: Custom JavaScript particle system with mouse interaction, connection algorithms, and performance optimization
- **Animation Framework**: CSS keyframes with JavaScript control for typing effects, floating animations, and smooth transitions
- **Glass Morphism**: Backdrop-filter effects with rgba backgrounds and neon border styling
- **Responsive Design**: Mobile-first approach with adaptive particle counts and responsive layout systems

### Design System
Comprehensive sci-fi aesthetic with consistent theming:
- **Typography**: Orbitron, Exo 2, and Space Mono fonts for futuristic text styling
- **Color Palette**: Cyber cyan (#00FFFF), neon purple (#8B00FF), lime green (#32CD32), and electric blue (#0080FF)
- **Component Patterns**: Glass panels, holographic borders, neon glow effects, and animated backgrounds
- **Theme System**: CSS custom properties for consistent color and spacing across all components

### Project Structure
Monorepo architecture with clear separation of concerns:
- **client/**: React frontend application with component-based file organization
- **server/**: Express.js backend with modular route handlers and storage abstractions  
- **shared/**: Common TypeScript types and database schemas using Drizzle ORM
- **Configuration**: Centralized tooling for build processes, linting, and development workflows

## External Dependencies

### Database & ORM
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect for future database integration
- **Neon Database**: Serverless PostgreSQL database configured for potential backend data storage
- **Database Schema**: User authentication and data models with UUID primary keys and proper indexing

### UI & Styling Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives including dialogs, dropdowns, and form controls
- **Tailwind CSS**: Utility-first CSS framework with custom configuration for sci-fi theming
- **shadcn/ui**: Pre-built component library built on Radix UI with consistent design patterns
- **Class Variance Authority**: Utility for creating variant-based component APIs with TypeScript support

### Development & Build Tools
- **Vite**: Modern build tool with fast HMR, optimized bundling, and plugin ecosystem
- **TypeScript**: Static type checking with strict configuration for enhanced developer experience
- **ESBuild**: Fast JavaScript bundler integrated with Vite for production builds
- **PostCSS**: CSS processing with Autoprefixer for cross-browser compatibility

### External Fonts & Icons
- **Google Fonts**: Orbitron, Exo 2, and Space Mono fonts loaded via CDN for futuristic typography
- **Font Awesome**: Icon library for social media links, navigation elements, and decorative icons
- **CDN Integration**: External font and icon resources loaded for optimal performance and reliability