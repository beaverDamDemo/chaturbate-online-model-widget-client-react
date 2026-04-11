# Chaturbate Online Model Widget Client

Starter frontend scaffold built with React, Vite, TypeScript, Tailwind CSS, React Router, and React Query.

The frontend is now prepared to talk to a local Spring Boot backend using JWT bearer tokens.

## Included

- Login page wired to backend JWT auth
- Register page wired to backend JWT auth
- Favorites page backed by backend API calls
- Account page with authenticated self-delete flow
- Status dashboard powered by a backend React Query request
- Protected routes for dashboard and favorites

## Install

```bash
npm install
```

The current scaffold already includes these packages:

```bash
npm install react-router-dom @tanstack/react-query tailwindcss @tailwindcss/vite
```

## Run

```bash
npm run dev
```

Vite now runs on `http://localhost:3000` and proxies `/api` requests to `http://localhost:8080` during development.

Environment files included:

- `.env.development` uses `VITE_API_BASE_URL=/api` so local requests go through the Vite proxy to `http://localhost:8080`.
- `.env.production` also defaults to `VITE_API_BASE_URL=/api` for same-domain deployments.
- If your live API is hosted on a different domain, update `.env.production` to your full API URL before building.

## Build

```bash
npm run build
```

## Folder Guide

```text
src/
  app/               Router and React Query client
  features/
    auth/            Demo auth context and route guard
    favorites/       Favorites data and local storage hook
    status/          Mock dashboard API
  pages/             Login, favorites, and dashboard pages
```

## Next Replacements

1. Make sure Spring Boot exposes the endpoints listed below.
2. Adjust response payloads if your backend returns different field names.
3. Set `VITE_API_BASE_URL` only if you do not want to use the Vite dev proxy.

## JWT Auth Flow

1. The login request posts credentials to `/api/auth/login`.
2. The register request posts name, email, and password to `/api/auth/register`.
3. The backend returns an access token and user payload for either login or register.
4. The frontend stores the access token in local storage.
5. Every authenticated request sends `Authorization: Bearer <token>`.
6. On app load, the frontend calls `/api/auth/me` if a token is present.

## Expected Backend Endpoints

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
DELETE /api/auth/me
POST   /api/auth/logout
GET    /api/favorites
PUT    /api/favorites/:id
GET    /api/dashboard/status
```

## Expected Payload Shapes

```json
{
  "accessToken": "jwt-access-token-here",
  "user": {
    "id": 1,
    "email": "operator@example.com",
    "name": "Operator"
  }
}
```

The login and register responses may also use `token` instead of `accessToken`, but `accessToken` is the preferred field name.

```json
{
  "name": "Operator",
  "email": "operator@example.com",
  "password": "strong-password"
}
```

```json
[
  {
    "id": "model-1",
    "name": "Model Name",
    "category": "Top performer",
    "status": "online",
    "tags": ["vip", "evening"],
    "notes": "Backend supplied note",
    "isFavorite": true
  }
]
```

```json
{
  "activeModels": 18,
  "onlineFavorites": 7,
  "averageResponseSeconds": 32,
  "conversionRate": 6.8,
  "alerts": [
    {
      "id": "alert-1",
      "title": "Schedule drift detected",
      "tone": "watch",
      "detail": "Two streams started late."
    }
  ],
  "timeline": [
    {
      "hour": "12:00",
      "viewers": 120,
      "revenue": 55
    }
  ]
}
```

TEMPORARY
cd "C:\Users\Fjasdojf\Documents\dev\chaturbate-online-model-widget\chaturbate-online-model-widget-client-react"
npm run dev
