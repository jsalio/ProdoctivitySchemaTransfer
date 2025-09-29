# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Prodoctivity Schema Transfer is a migration and synchronization tool for document structures, users, workflows, and permissions between Prodoctivity Fluency (V5) and Prodoctivity Cloud (V6) systems. It features a TypeScript monorepo backend using Bun and Elysia, with an Angular frontend.

## Architecture

The codebase is structured as a full-stack application with clear separation between frontend and backend:

### Backend Architecture
- **Runtime**: Bun (v1.2.19+) with TypeScript
- **Framework**: Elysia web framework with Swagger documentation
- **Pattern**: Monorepo with workspaces in `backend/packages/`
- **Dependency Injection**: Custom DI container managing service lifecycles
- **Store Pattern**: Abstract `IStore` interface implemented by platform-specific stores

#### Key Backend Components
- `packages/Core/`: Domain models, use cases, and shared contracts
- `packages/Prodoctivity5/`: Prodoctivity Fluency V5 implementation
- `packages/ProdoctivityCloud/`: Prodoctivity Cloud V6 implementation  
- `packages/server/`: Elysia API server with routes and services
- **Services**: `AuthService` and `SchemaService` with store-specific instances
- **DI Container**: Located in `server/utils/injector.ts`, manages singleton services per store

### Frontend Architecture
- **Framework**: Angular 18+ with standalone components
- **Styling**: Tailwind CSS
- **Routing**: Lazy-loaded feature routes
- **Services**: HTTP-based services following repository pattern
- **Icons**: Modern SVG icon system with standalone components
- **Favicon**: Modern SVG favicon with ICO fallback support

#### Key Frontend Routes
- `/schema-transfer`: Main schema migration interface (default route)
- `/user-transfer`: User migration functionality
- `/connection-fail`: Connection error handling

#### Icon System
- **Location**: `src/app/shared/icons/` and `src/app/shared/iconography/`
- **Format**: Modern SVG components with Tailwind CSS styling
- **Available Icons**:
  - `sync`: Synchronization status (blue)
  - `check`: Success/completion status (green)
  - `warn`: Warning/attention status (orange)
  - `not-sync`: Inactive sync status (gray)
  - `unasign`: Logout/unassign status (red)
  - `loading`: Animated loading spinner (blue, with CSS animation)
- **Usage**: Via `<app-iconography>` component or direct icon components
- **Responsive**: All icons use `currentColor` and are responsive via Tailwind classes

## Development Commands

### Installation
```bash
# Install all dependencies (root, backend, and frontend)
make install

# Or install individually:
cd backend && bun install
cd frontend && npm install
```

### Development Servers
```bash
# Start both servers in parallel using tmux
make all

# Start backend only (runs on http://localhost:3000)
make backend
# OR: cd backend && bun run run_server

# Start frontend only (runs on http://localhost:4200)  
make frontend
# OR: cd frontend && npm start
```

### Testing
```bash
# Backend tests
cd backend && bun test

# Frontend tests
cd frontend && npm test
cd frontend && npm run test:headless  # For CI/headless testing (no browser window)
```

### Building
```bash
# Build both for production
make build_all

# Build backend executable (Windows x64)
make build_backend
# OR: cd backend && bun run build:exec

# Build frontend for production
make build_frontend
# OR: cd frontend && npm run build
```

### Packaging
```bash
# Create distribution package (requires both frontend and backend to be built)
make package
# OR: ./build_packages.sh (Linux/Mac) or ./build_packages.ps1 (Windows)
```

### Code Formatting
```bash
# Format all code
npm run format:backend
npm run format:frontend

# Or format individually:
cd backend && bun run format
cd frontend && npm run format
```

### Linting
```bash
# Lint all code
npm run lint

# Lint backend only
npm run lint:backend
# OR: cd backend && bun run lint

# Lint frontend only
npm run lint:frontend
# OR: cd frontend && npm run lint

# Auto-fix linting issues
npm run lint:fix
npm run lint:backend:fix
npm run lint:frontend:fix
```

## API Documentation

The backend provides Swagger documentation at `http://localhost:3000/swagger` when running in development mode.

## Quality Assurance

- **Pre-commit hooks**: Automated testing and formatting via Husky
- **Lint-staged**: Prettier formatting on staged files
- **Testing**: Both backend (Bun) and frontend (Karma/Jasmine) test suites must pass before commits

## Store Implementation Pattern

When adding support for new platforms, implement the `IStore` interface and register both `AuthService` and `SchemaService` instances in the DI container with platform-specific prefixes (e.g., `AuthServiceNewPlatform`, `SchemNewPlatformService`).

## Assets and UI/UX Guidelines

### Favicon Implementation
- **Modern SVG**: `frontend/public/favicon.svg` - Scalable vector icon with transfer/sync theme
- **Fallback ICO**: `frontend/public/favicon.ico` - For older browser compatibility
- **Apple Touch Icon**: Uses SVG for iOS devices
- **Implementation**: Progressive enhancement (SVG first, ICO fallback)

### Icon Design Principles
- **Consistency**: All icons follow the same visual language (stroke-based, rounded corners)
- **Color Coding**: Semantic color usage (blue=active, green=success, orange=warning, red=error, gray=inactive)
- **Accessibility**: Icons use `currentColor` for theme compatibility and proper contrast
- **Scalability**: SVG format ensures crisp rendering at any size
- **Animation**: Loading states use CSS `animate-spin` utility

### Adding New Icons
1. Create SVG component in `src/app/shared/icons/{icon-name}/`
2. Follow existing patterns: standalone component, Tailwind classes, proper viewBox
3. Add to iconography component if needed for centralized usage
4. Use semantic colors and consistent stroke-width
5. Test at different sizes (w-4 h-4, w-6 h-6, w-8 h-8)

## Build Targets

- **Backend**: Compiles to Windows x64 executable (`SchemaTransfer.exe`)
- **Frontend**: Standard Angular production build to `dist/`
- **Distribution**: Combined package in `Distributable/` directory structure
