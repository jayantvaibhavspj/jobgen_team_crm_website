# Jobgen Marketing OS & Team CRM — Setup Guide

Follow this guide to configure Supabase backend and authentication, enable realtime multi-user collaboration, and deploy to Vercel.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, choose an organization and project name (e.g. `jobgen-team-crm`).
3. Set a database password and select your preferred region.

---

## 2. Run Database Schema

1. Open your Supabase project dashboard.
2. Click on the **SQL Editor** tab in the left navigation.
3. Open `supabase/schema.sql` from this repository.
4. Paste the entire content into the SQL Editor and click **Run**.
5. This automatically creates:
   - Tables: `workspaces`, `profiles`, `leads`, `lead_timeline`, `tasks`, `events`, `campaigns`, `competitors`, `automation_rules`.
   - Row Level Security (RLS) policies scoped to `workspace_id`.
   - Auto-profile trigger for new auth signups.
   - Realtime publication for `leads`, `tasks`, `campaigns`, and `events`.

---

## 3. Set Local Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. In your Supabase dashboard, go to **Project Settings** > **API**.
3. Copy **Project URL** and set it as `VITE_SUPABASE_URL`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   ```
4. Copy the **anon / public** key and set it as `VITE_SUPABASE_ANON_KEY`:
   ```env
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## 4. Create the First Admin Account

1. Open your app at `http://localhost:5173/login`.
2. Click **Create account**.
3. Enter your full name, email, and password.
4. Because this is the first profile in the database, the database trigger (`handle_new_user`) automatically assigns you the **admin** role.
5. All subsequent signups default to the **member** role, which you can manage in **Settings** > **Team Members**.

---

## 5. Enable Email Auth & Magic Links in Supabase

1. In the Supabase dashboard, navigate to **Authentication** > **Providers**.
2. Ensure **Email** is enabled.
3. Under **Authentication** > **URL Configuration**, add your local dev URL and production domain to **Redirect URLs**:
   - `http://localhost:5173/**`
   - `https://your-app.vercel.app/**`

---

## 6. Deploy to Vercel

1. Push your changes to GitHub on `feature/supabase-team-crm` or merge to `main`.
2. Import the repository in [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Deploy! `vercel.json` is already configured for client-side single page app (SPA) routing.

---

## 7. Offline / Demo Mode Fallback

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not provided, the application automatically runs in offline mode using `localStorage`, ensuring zero friction for testing and development.
