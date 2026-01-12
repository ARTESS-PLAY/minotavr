# Docker Setup Guide

## Overview

This project is containerized using Docker and Docker Compose for consistent development and production environments.

## Prerequisites

-   Docker (v20+)
-   Docker Compose (v2.0+)
-   For Windows: WSL2 backend recommended

## Building the Docker Image

To build the image locally:

```bash
docker build -t minotavr:latest .
```

## Running with Docker Compose

### Start the application

```bash
docker-compose up
```

### Start in background mode

```bash
docker-compose up -d
```

### View logs

```bash
docker-compose logs -f server
```

### Stop the application

```bash
docker-compose down
```

## Development Workflow

### Build and run for development

```bash
docker-compose up --build
```

### Run development server with hot reload (local machine)

```bash
npm run dev
```

### Access the application

-   Server: http://localhost:3000
-   Map endpoint: http://localhost:3000/map

## Production Deployment

### Build production image

```bash
docker build -t minotavr:prod .
```

### Run in production

```bash
docker run -d -p 3000:3000 --name minotavr-server minotavr:prod
```

## Troubleshooting

### Container fails to start

Check logs:

```bash
docker-compose logs server
```

### Port already in use

Change the port mapping in `docker-compose.yml`:

```yaml
ports:
    - '3001:3000' # Maps host port 3001 to container port 3000
```

### Build fails

Clear Docker cache and rebuild:

```bash
docker-compose build --no-cache
```

## Environment Variables

Configure via `docker-compose.yml` environment section:

-   `NODE_ENV`: Set to 'production' or 'development'

Add more as needed in your `serverConfig.ts`.

## Volumes

The public directory is mounted as a volume for easy updates:

```yaml
volumes:
    - ./public:/app/public
```

## Health Checks

The container includes a health check that validates the server is responding to HTTP requests.

## Multi-stage Build Benefits

The Dockerfile uses a multi-stage build to:

1. **Build stage**: Compile TypeScript and install dev dependencies
2. **Runtime stage**: Only include production dependencies in final image
3. Reduces final image size by ~50%
