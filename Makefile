.PHONY: backend frontend install all build_backend build_frontend build_all package

# ==============================================================================
# Development Commands
# ==============================================================================

# install: Installs all project dependencies
#   - Backend: Uses Bun to install Node.js packages
#   - Frontend: Uses npm to install Node.js packages
install:
	cd backend && bun install
	cd frontend && npm install

# backend: Starts the backend development server
#   - Runs the backend server using Bun
backend:
	cd backend && bun run run_server

# frontend: Starts the frontend development server
#   - Runs the Angular development server
frontend:
	cd frontend && npm start

# all: Runs both frontend and backend servers in parallel using tmux
#   - Splits the terminal into two panes
#   - Left pane runs the backend server
#   - Right pane runs the frontend development server
all:
	tmux new-session -d 'make backend' \; \
	split-window -h 'make frontend' \; \
	attach-session

# ==============================================================================
# Build Commands
# ==============================================================================

# build_backend: Builds the backend for production
#   - Compiles TypeScript to JavaScript
#   - Creates an optimized production build
build_backend:
	cd backend && bun run build:exec

# build_frontend: Builds the Angular application for production
#   - Creates an optimized production build in the dist/ directory
build_frontend:
	cd frontend && npm run build

# build_all: Builds both frontend and backend in parallel using tmux
#   - Left pane builds the backend
#   - Right pane builds the frontend
build_all:
	tmux new-session -d 'make build_backend' \; \
	split-window -h 'make build_frontend' \; \
	attach-session

# ==============================================================================
# Packaging
# ==============================================================================

# package: Creates distribution packages
#   - Executes the build_packages.sh script to create distributable packages
package:
	./build_packages.sh
