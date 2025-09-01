.PHONY: backend frontend install all build_backend build_frontend package

# Install dependencies for both frontend and backend
install:
	cd backend && bun install
	cd frontend && npm install

# Run the backend server
backend:
	cd backend && bun run run_server

# Run the frontend development server
frontend:
	cd frontend && npm start

# Run both frontend and backend in parallel
all:
	tmux new-session -d 'make backend' \; \
	split-window -h 'make frontend' \; \
	attach-session

# Build and prepare app on executable file for windows
build_backend:
	cd backend && bun run build:exec

# Build the angular app
build_frontend:
	cd frontend && npm run build

package:
	./build_packages.sh
