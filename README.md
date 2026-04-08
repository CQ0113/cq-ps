# Portfolio CMS (Initial Scaffold)

## Stack
- React + Vite
- Tailwind CSS (dark mode)
- Framer Motion
- Lucide React
- Firebase Auth + Firestore
- React Router v6

## Setup
1. Install dependencies:
   - `npm install`
2. Copy `.env.example` to `.env` and fill your Firebase credentials.
3. Start development server:
   - `npm run dev`

## Authentication Rules Implemented
- Google Sign-In on `/login`
- If authenticated email is `chengqingchu113@gmail.com` -> redirect to `/admin`
- Any other email -> redirect to `/`
- Guest users stay in `/`
- `/admin` is protected and redirects unauthorized users to `/`

## Next Step
Implement Firestore-backed CRUD forms for:
- projects
- experience
- skills
- academics
# cq-portfolio
