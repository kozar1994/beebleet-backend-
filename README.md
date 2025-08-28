# Subscription Management API

This project is a NestJS-based server application designed to manage user subscription plans. It handles the initial selection of a subscription plan, changes between plans, and maintains a history of subscriptions and transactions. The application uses Prisma as its ORM and PostgreSQL for the database.

## Project Overview

This system provides a clear workflow for managing user subscriptions, from the moment a user first subscribes to any subsequent plan changes.

### Database Schema

The database is designed to logically store information about users, plans, subscriptions, and billing history.

![Database Schema](./dbshemas.png)

### Initial Subscription Flow

This diagram illustrates the process when a new user subscribes to a plan for the first time.

![Initial Subscription Flow](./flow1.png)

### Plan Change Flow

This diagram shows the extended workflow for when an existing user changes their subscription from one plan to another.

![Plan Change Flow](./flow2.png)

---

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v20 or later)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started) and Docker Compose

### Installation & Running

There are two ways to run this project:

#### Option 1: Using Docker (Recommended)

This is the simplest method and replicates the production environment. It will build the application, start the database, run migrations, and seed the database all with a single command.

1.  **Build and Run the Containers:**
    ```bash
    docker-compose up --build
    ```
2.  The application will be available at `http://localhost:3000`.

To stop the application and the database, press `Ctrl + C` or run `docker-compose down`.

#### Option 2: Manual Step-by-Step Setup

This method gives you more granular control over each component.

1.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

2.  **Create Environment File:**
    Create a `.env` file in the root of the project and add the database connection string:

    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/beebleet?schema=public"
    ```

3.  **Start the Database:**
    Run the following command to start the PostgreSQL database container in the background:

    ```bash
    docker-compose up postgres -d
    ```

4.  **Run Database Migrations:**
    Apply all pending migrations to create the database schema:

    ```bash
    pnpm run prisma:migrate:deploy
    ```

5.  **Seed the Database:**
    Run the seed script to populate the database with initial data, such as subscription plans:

    ```bash
    pnpm run prisma:seed
    ```

6.  **Start the Application:**
    Run the application in development mode (with hot-reload):
    ```bash
    pnpm run start:dev
    ```

---

## API Documentation

Once the application is running, you can access the Swagger UI for interactive API documentation.

- **Swagger UI URL:** [**http://localhost:3000/api-swagger**](http://localhost:3000/api-swagger)
