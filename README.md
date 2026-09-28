# Mercado

Mercado is a full-stack product catalog application with JWT authentication, protected seller actions, product management, image uploads, and a React frontend.

The repository contains a Node.js/Express backend and a Vite/React frontend.

## Features

- User registration and login
- Short-lived JWT access tokens
- Refresh-token authentication with an httpOnly cookie
- Authenticated profile and logout endpoints
- Product creation, listing, editing, deletion, listing, and unlisting
- Image uploads through ImageKit
- Express Validator request validation with field-level errors
- React Hook Form for frontend form handling
- Redux Toolkit for authentication state
- TanStack Query for product queries and mutations
- Axios for API requests
- React Router data-router configuration

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── app/              Express app setup
│   │   ├── config/           Database, environment, and upload configuration
│   │   ├── controllers/      Request handlers
│   │   ├── middlewares/      Authentication and authorization middleware
│   │   ├── models/           Mongoose models
│   │   ├── routes/           Auth and product routes
│   │   ├── services/         External storage services
│   │   ├── utils/            JWT and auth helpers
│   │   └── validators/       Express Validator rules
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/              Store, providers, and router
│   │   ├── components/       Shared UI components
│   │   ├── features/         Auth and product feature modules
│   │   ├── services/         Axios API client
│   │   └── styles.css
│   └── package.json
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB, local or hosted
- ImageKit account for product image uploads

## Configuration

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/authproject
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
```

Keep secrets out of source control. The frontend uses the Vite development proxy and does not require a separate API URL for local development.

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running Locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:3000`.

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend.

Create a production frontend build with:

```bash
cd frontend
npm run build
```

## Deploying Backend to Render and Frontend to Vercel

Push the repository to GitHub first. Deploy the backend before the frontend so the Render URL is available.

### Render backend

1. Create a Render Web Service from the repository.
2. Set the service root directory to `backend`.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Add `MONGO_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT` as secret environment variables.
5. Set `NODE_ENV=production` and `FRONTEND_URL` to the final Vercel URL, for example `https://your-app.vercel.app`.

### Vercel frontend

1. Import the same repository as a Vercel project.
2. Set the Vercel root directory to `frontend`.
3. Add `VITE_API_URL` with the deployed Render URL, for example `https://your-api.onrender.com`.
4. Deploy. The frontend Axios client will send requests to `VITE_API_URL/api/...` and include the refresh-token cookie.

Use `npm run build` as the Vercel build command and `dist` as the output directory. The Render service must be reachable from the browser, and its CORS `FRONTEND_URL` value must exactly match the Vercel origin.

## API Reference

All API routes are prefixed with `/api`.

### Authentication

| Method | Endpoint             | Access                     | Description                             |
| ------ | -------------------- | -------------------------- | --------------------------------------- |
| `POST` | `/api/auth/register` | Public                     | Create a user account                   |
| `POST` | `/api/auth/login`    | Public                     | Authenticate and return an access token |
| `POST` | `/api/auth/refresh`  | Public with refresh cookie | Issue a new access token                |
| `GET`  | `/api/auth/me`       | Authenticated              | Return the current user                 |
| `GET`  | `/api/auth/logout`   | Authenticated              | Invalidate the refresh token            |

Send the access token on protected requests:

```http
Authorization: Bearer <access-token>
```

The refresh token is handled through the browser cookie. Do not store passwords or refresh tokens in frontend state.

### Products

| Method   | Endpoint                   | Access               | Description          |
| -------- | -------------------------- | -------------------- | -------------------- |
| `POST`   | `/api/products`            | Authenticated seller | Create a product     |
| `GET`    | `/api/products`            | Authenticated        | List products        |
| `GET`    | `/api/products/:id`        | Authenticated        | Get one product      |
| `GET`    | `/api/products/seller`     | Authenticated seller | List seller products |
| `PUT`    | `/api/products/update/:id` | Authenticated seller | Update a product     |
| `DELETE` | `/api/products/delete/:id` | Authenticated seller | Delete a product     |
| `PATCH`  | `/api/products/list/:id`   | Authenticated seller | Publish a product    |
| `PATCH`  | `/api/products/unlist/:id` | Authenticated seller | Unpublish a product  |

Product create and update requests use `multipart/form-data`. Use these fields:

- `title`
- `description`
- `price` as a JSON string, for example `{"amount":100,"currency":"INR"}`
- `sizes` as a JSON string, for example `[{"size":"M","stock":5}]`
- `images` as one or more image files

Invalid request data returns HTTP `400` with field-level errors, for example:

```json
{
  "message": "invalid request",
  "errors": [
    {
      "type": "field",
      "value": "bad",
      "msg": "Product id must be a valid MongoDB ObjectId",
      "path": "id",
      "location": "params"
    }
  ]
}
```

## Frontend Architecture

- `features/auth` contains login, registration, Redux auth state, and protected-route behavior.
- `features/products` contains product queries, mutations, dashboard UI, and the product form.
- `services/api.js` contains the shared Axios client, bearer-token header setup, refresh-cookie support, and API error normalization.
- React Hook Form handles field registration, client-side validation, dynamic product sizes, and multipart form preparation.
- Redux Toolkit stores the access token and authentication status.
- TanStack Query manages product loading, caching, invalidation, and mutation state.
- React Router handles public auth pages and the protected seller dashboard.

## Security Notes

- Passwords are hashed by the backend before storage.
- Passwords are never returned to the frontend.
- JWT secrets must be supplied through environment variables.
- Refresh tokens are stored server-side so logout can revoke them.
- The refresh token is sent using an httpOnly cookie.
- Product writes require authentication and seller authorization.
- Never commit `.env` files or production secrets.

## Current Scope

The application uses a single seller workflow: users register or log in through the same auth pages, and seller-only product operations are controlled by the backend role and middleware. There is no separate seller login or registration UI.
