# CloudPrep — AZ-104 Practice

CloudPrep is split into a React client and an Express REST API. The API stores users and attempts in MongoDB. Each quiz step selects a different question from the curated 100-question AZ-104 bank and shuffles the order for each attempt.

## Run locally

## Setup

Install dependencies from the repository root and client folder:

```powershell
npm install
npm --prefix client install
```

Copy `.env.example` to `.env` and set `JWT_SECRET`. The default database is local MongoDB at `mongodb://127.0.0.1:27017/cloudprep`; set `MONGODB_URI` for MongoDB Atlas.

Run the API and React client in separate terminals:

```powershell
npm run server
npm run client
```

Open `http://localhost:5173`.

## Included

- React authentication, course, section, quiz, and profile screens
- Express REST endpoints for auth, questions, and attempts
- Mongoose User model
- Password hashing with bcrypt and JWT authentication
- Five AZ-104 sections with 20-question attempts
- Server-side random question selection with per-attempt repeat protection
- MongoDB-backed profile and attempt history

The questions are original practice material and are not official Microsoft exam questions.

The old static files remain in the repository as reference, but the new entry points are `client/src/App.jsx` and `server/index.js`. For production, use HTTPS, a durable session strategy, rate limiting, and a managed MongoDB deployment.
