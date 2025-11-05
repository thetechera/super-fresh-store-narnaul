# Super Fresh Store – Inventory Management System

This is a full-stack inventory management system built with React and Vercel Serverless Functions, using a Neon serverless Postgres database.

## Local Development

To run this project locally, you'll need to install the Vercel CLI. This allows you to run the frontend and the serverless backend functions in an environment that mirrors the Vercel production setup.

### Step 1: Install Vercel CLI

If you don't have it already, install the Vercel CLI globally:

```bash
npm i -g vercel
```

### Step 2: Set up the Database with Neon

1.  Go to [Neon](https://neon.tech), sign up for a free account, and create a new project.
2.  In your Neon project dashboard, find the **Connection Details** section.
3.  Copy the **connection string** that starts with `postgres://`. This is your database URL.

### Step 3: Configure Environment Variables

1.  Create a file named `.env` in the root of your project.
2.  Add your Neon database connection string to this file:

    ```
    POSTGRES_URL="postgres://user:password@host.neon.tech/dbname?sslmode=require"
    ```

    Vercel will use this file to provide the `process.env.POSTGRES_URL` to your serverless functions when running locally. **Do not commit this file to Git.**

### Step 4: Run the Development Server

1.  Log in to your Vercel account through the CLI:

    ```bash
    vercel login
    ```

2.  Start the development server:

    ```bash
    vercel dev
    ```

    This command starts the Vite frontend server and the Vercel serverless functions. Your application will be available at a local URL provided in the terminal (usually `http://localhost:3000`).

### Step 5: Set Up Database Tables

The first time you run the application, you need to create the database tables.

1.  With the development server running, open your browser and navigate to:
    **`http://localhost:3000/api/setup`**
2.  You should see a success message. Your database is now ready for local development.

## Deployment with Vercel

This project is configured for seamless deployment on the Vercel Platform.

### Step 1: Deploy the Project

1.  **Fork this repository** to your own GitHub account.
2.  Go to your Vercel dashboard and click **"Add New... -> Project"**.
3.  **Import the Git Repository** you just forked.
4.  Vercel will automatically detect that this is a Vite project.

### Step 2: Configure Environment Variables in Vercel

Before deploying, you need to provide your Neon database URL to Vercel.

1.  In the "Configure Project" screen, expand the **Environment Variables** section.
2.  Add a new variable:
    -   **Name**: `POSTGRES_URL`
    -   **Value**: Paste your Neon connection string here.

3.  Click **Deploy**.

### Step 3: Set Up Production Database Tables

Just like in local development, you need to initialize the tables in your production database.

1.  After the deployment is complete, find your Vercel deployment URL (e.g., `https://your-project-name.vercel.app`).
2.  In your browser, navigate to the setup URL:
    **`https://<YOUR_DEPLOYMENT_URL>/api/setup`**
3.  After seeing the success message, your application is fully configured and operational!
