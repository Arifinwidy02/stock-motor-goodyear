# stock-motor-goodyear

Goodyear electrical motor stock management application built with Express.js + Sequelize + PostgreSQL.

## Prerequisites

- Node.js
- Yarn
- PostgreSQL (running locally)

## Setup

```bash
# 1. Install dependencies
yarn install

# 2. Copy env template and adjust DATABASE_URL to your local PostgreSQL
cp .env.example .env

# 3. Create PostgreSQL database
createdb stock_motor

# 4. Run migrations
npx sequelize-cli db:migrate

# 5. Seed data (optional)
npx sequelize-cli db:seed:all

# 6. Start server
yarn start
```

Server runs on `http://localhost:3000`.

## Database Config

Rename `.env.example` to `.env` and set your local `DATABASE_URL`:
```
DATABASE_URL=postgres://youruser:yourpassword@127.0.0.1:5432/stock_motor
```

`.env` is gitignored and won't be committed to the public repo.

## All Routes

| Method  | Route               | Description                                                                        |
| ------- | ------------------- | ---------------------------------------------------------------------------------- |
| `GET`   | `/`                 | Welcome / health check                                                             |
| `GET`   | `/dashboard`        | All non-hidden motors (supports `?sortColumn=ASC\|DESC` and `?id_number=X` filter) |
| `GET`   | `/dashboard/status` | All statuses                                                                       |
| `GET`   | `/dashboard/repair` | All repair records (with motor & status relations)                                 |
| `GET`   | `/dashboard/:id`    | Single motor by ID                                                                 |
| `POST`  | `/`                 | Register new motor (auto-generates QR code)                                        |
| `PUT`   | `/dashboard/:id`    | Edit motor (manages repair lifecycle)                                              |
| `PATCH` | `/`                 | Change motor status by QR code scan (`{ "qrcode": "..." }`)                        |
| `PATCH` | `/hidden/:id`       | Toggle hide/unhide motor (soft delete)                                             |
