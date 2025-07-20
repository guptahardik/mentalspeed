# MentalSpeed

A simple full-stack mental math practice app similar to Zetamac. Frontend uses React via CDN and Tailwind CSS. Backend uses Node.js, Express and MongoDB.

## Setup

1. Install dependencies (requires internet):

```bash
cd server
npm install
```

2. Start MongoDB locally or set `MONGO` environment variable.

3. Start backend:

```bash
npm start
```

4. Serve static files in `client` folder (e.g., `npx serve client`). The frontend expects the API at `/api` on the same host.

## Deployment

Deploy frontend to any static host (Vercel/Netlify). Deploy backend to Node host (Railway/Render) with environment variable `MONGO` pointing to MongoDB instance.

## Features

- Timed mental math sessions
- Keyboard input for speed
- Basic login/signup
- Stores session results in MongoDB
- Dashboard with chart of scores over time
