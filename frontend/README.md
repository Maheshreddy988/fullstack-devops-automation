# frontend

React + Vite UI for the Express/MongoDB backend (`/api/v1/auth/*`).

## Run locally
```bash
npm install
npm run dev          # http://localhost:5173, /api proxied to http://localhost:5000
```
Point to another backend: `VITE_BACKEND_URL=http://host:5000 npm run dev`

## Docker
```bash
docker build -t frontend .
docker run -p 8080:80 --add-host backend:host-gateway frontend
```
Nginx serves the build and proxies `/api/` to the host `backend:5000`
(the service name used in docker-compose and Kubernetes). Health check: `/healthz`.
