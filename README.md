# light-it

Patient registration API built with NestJS + TypeORM + PostgreSQL.
The patient document image is uploaded to Cloudinary, and only the URL is stored in the database.
Confirmation email sending is asynchronous through BullMQ + Redis + Nodemailer.

## Requirements

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## 1) Install dependencies

```
npm install
```

## 2) Configure environment variables

This repo uses a root `.env` file (see [src/app.module.ts](src/app.module.ts)).
The same `POSTGRES_*` and `REDIS_*` values are used by both the API and `docker-compose.yaml`.

Copy `templates.env` to `.env`:

Expected variables:

```
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=password123
POSTGRES_DB=myapp_db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

MAIL_PROVIDER=gmail
MAIL_USER=lightitpatient@gmail.com
MAIL_FROM=lightitpatient@gmail.com
MAIL_KEY=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=node161
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

Required mail variables are `MAIL_PROVIDER`, `MAIL_USER`, `MAIL_FROM`, and `MAIL_KEY`.
If any required value is missing or empty, the app will throw an error at startup.

## 3) Start PostgreSQL and Redis with Docker

```
docker compose up -d postgres redis
```

Verify it is running:

```
docker compose ps
```

## 4) Run the API

Development mode:

```
npm run start:dev
```

API base URL:

- `http://localhost:3000`

## 5) Test with Swagger

Swagger UI:

- `http://localhost:3000/api/docs`

Main endpoint: `POST /patients` using `multipart/form-data` with:

- `fullName` (string)
- `emailAddress` (string)
- `phoneNumber` (string)
- `documentPhoto` (image file)

After patient creation, a background BullMQ worker sends the confirmation email from the queue.

## Quick curl example

```
curl -X POST "http://localhost:3000/patients" \
  -F "fullName=John Doe" \
  -F "emailAddress=johndoe@example.com" \
  -F "phoneNumber=+541122233344" \
  -F "documentPhoto=@./path/to/your/image.jpg"
```

## Useful commands

```
npm run build
npm run lint
npm test
```
