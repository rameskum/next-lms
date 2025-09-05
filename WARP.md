# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js-based Learning Management System (LMS) project called "next-lms" featuring modern web technologies including React 19, Prisma ORM, Better Auth, AWS S3 integration, and shadcn/ui components.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm check-format` - Check code formatting

### Database Commands (Prisma)
- `npx prisma generate` - Generate Prisma client (outputs to `src/generated/prisma`)
- `npx prisma db push` - Push schema changes to database
- `npx prisma db pull` - Pull schema from database
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma migrate deploy` - Deploy migrations to production

### Component Development
- `npx shadcn add [component]` - Add shadcn/ui components
- `npx shadcn` - Access shadcn CLI for component management

## Architecture & Code Organization

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
  - `(auth)/` - Authentication pages (login, etc.)
  - `(public)/` - Public routes
  - `admin/` - Admin-only routes with course management
  - `api/` - API routes including S3 upload/delete endpoints
- `src/components/` - Reusable React components
  - `ui/` - shadcn/ui base components
  - `file-uploader/` - Custom file upload components
- `src/lib/` - Shared utilities and configurations
  - `auth.ts` - Better Auth configuration
  - `db.ts` - Prisma client instance
  - `env.ts` - Environment variable validation with t3-env
  - `s3-client.ts` - AWS S3 client setup
- `src/hooks/` - Custom React hooks
- `src/generated/prisma/` - Auto-generated Prisma client
- `prisma/schema.prisma` - Database schema definition

### Key Technologies & Patterns

**Authentication**: Uses Better Auth with GitHub OAuth and admin plugin for role-based access control. User roles are managed through the `role`, `banned`, `banReason`, and `banExpires` fields.

**Database**: PostgreSQL with Prisma ORM. Custom client output location at `src/generated/prisma`. Main models include User, Course, Session, Account, and Verification.

**File Storage**: AWS S3 integration with presigned URLs for secure file uploads. Custom file uploader component with drag-and-drop, progress tracking, and error handling.

**UI Framework**: 
- Tailwind CSS v4 with custom theme configuration in `globals.css`
- shadcn/ui components (New York style) with custom variants
- Dark mode support with CSS variables
- Responsive design with mobile-first approach

**Form Handling**: React Hook Form with Zod validation and @hookform/resolvers for form state management.

**Rich Text Editing**: TipTap editor with starter kit for content creation (courses, descriptions).

**State Management**: Uses React 19 features with server components and client components pattern.

### Environment Configuration

Environment variables are validated using `@t3-oss/env-nextjs` in `src/lib/env.ts`:

**Required Server Variables:**
- `BETTER_AUTH_SECRET` - Authentication secret
- `BETTER_AUTH_URL` - Auth callback URL
- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth
- AWS S3 credentials: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_ENDPOINT_URL_IAM`, `AWS_REGION`

**Required Client Variables:**
- `NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES` - S3 bucket for image uploads

### Course Management Features

The application includes a complete course management system with:
- Course CRUD operations with admin-only access
- Course metadata: title, description, slug, duration, price, level (BEGINNER/INTERMEDIATE/ADVANCED)
- Course status workflow: DRAFT → PUBLISHED → ARCHIVED
- File attachments via S3 integration
- Rich text descriptions using TipTap

### Development Patterns

**API Routes**: Follow REST conventions with proper error handling and admin authorization checks. S3 operations use presigned URLs for client-side uploads.

**Component Architecture**: Functional components with TypeScript, following shadcn/ui patterns. Components use `cn()` utility for conditional styling with tailwind-merge.

**Data Fetching**: Server components for initial data loading, with client components for interactive features. Uses React 19 concurrent features where appropriate.

**Error Handling**: Consistent error responses with proper HTTP status codes. Client-side error handling with toast notifications using Sonner.

## Testing & Quality

- ESLint configuration extends Next.js rules with TypeScript support
- Prettier for consistent code formatting with Tailwind plugin
- Type safety enforced throughout with TypeScript 5.x
- Environment validation prevents runtime configuration errors

## Deployment Considerations

- Turbopack is used for both development and production builds
- Database migrations should be run before deployment
- S3 bucket permissions must be configured for presigned URL operations
- Environment variables must be properly set in production environment
- Better Auth requires proper URL configuration for OAuth callbacks
