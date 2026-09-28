# Nuxt Role Auth

**Name:** Fathan Mubina

A small full-stack Nuxt 3 application with login authentication and role-based page authorization.

## Overview

- `/` redirects to `/login`.
- `/login` validates the form with **Yup** in the browser and the request body with **Zod** on the server.
- On success the server stores the user (`username`, `role`) in an **H3 session** (`useSession`, sealed cookie).
- `/home` is available to any signed-in user. It shows the username and role, a logout button, and an admin link for admins.
- `/admin` is available to the `admin` role only.
- Page permissions are enforced by **server middleware** (`server/middleware/auth.ts`), which reads the H3 session before the page is rendered:
  - not signed in, `/home` or `/admin` → redirect to `/login`
  - signed in as `employee`, `/admin` → redirect to `/home`
  - already signed in, `/login` → redirect to `/home`

### Demo accounts

| Username   | Password   | Role       |
| ---------- | ---------- | ---------- |
| `admin`    | `admin`    | `admin`    |
| `employee` | `employee` | `employee` |

## Tech stack

Nuxt 3, TypeScript, H3 session, Nuxt UI v2 (`@nuxt/ui`) with Tailwind CSS, Yup, Zod.

Tested with `nuxt@3.21.11`, `@nuxt/ui@2.22.3`, `yup@1.7.1`, `zod@3.25.76`.

## Project structure

```
app.vue                      Layout shell and color mode toggle
app.config.ts                Nuxt UI theme (colors)
nuxt.config.ts               Modules and runtimeConfig (session secret)
tailwind.config.ts           Tailwind configuration
pages/
  index.vue                  Redirects to /login
  login.vue                  Login form with Yup validation
  home.vue                   Session info, admin link, logout
  admin.vue                  Admin-only page
server/
  api/login.post.ts          Zod validation, credential check, creates session
  api/session.get.ts         Returns the current session user (401 if none)
  api/logout.post.ts         Clears the session
  middleware/auth.ts         Page permission checks for /login, /home, /admin
  repositories/user.ts       Mock user store
  utils/session.ts           Shared H3 session config and helpers
types/auth.ts                Shared Role and SessionUser types
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build use `npm run build` then `npm run preview`.

Set your own session secret (32+ characters) outside of demos:

```bash
NUXT_SESSION_SECRET="a-long-random-string-with-at-least-32-characters" npm run dev
```

## Run on StackBlitz

1. Go to https://stackblitz.com and choose **Import from GitHub**, or create a new **Nuxt** project and drag this folder's files into the file tree (replace the existing files).
2. In the terminal run `npm install`, then `npm run dev`.
3. The preview opens on the login page.

If you stay signed out after a successful login inside the embedded preview, your browser is blocking third-party cookies for the preview iframe. Use **Open in new tab** on the preview. The session cookie is set with `SameSite=None; Secure` over https, so it works there too.

## Manual test checklist

1. Start the app: the login page is shown.
2. Visit `/home` while signed out: redirected to `/login`.
3. Sign in with `admin` / `admin`: redirected to `/home`, the **Open admin page** button is visible and `/admin` loads.
4. Sign out, then sign in with `employee` / `employee`: redirected to `/home`, no admin button.
5. As the employee, open `/admin` directly in the address bar: redirected back to `/home` by the server middleware.
6. Submit wrong credentials: an error message is shown. Submit fewer than 4 characters: Yup field errors are shown.

## Implementation notes

- Links to `/admin` and the redirect after login use full-page navigation (`navigateTo(..., { external: true })`). Nuxt client-side navigation does not hit the server, so this guarantees the server middleware evaluates every protected page.
- The middleware normalizes the request path (decoding, case, duplicate and trailing slashes) so variants such as `/ADMIN` or `/%61dmin` cannot bypass the check.
- The session cookie is `HttpOnly`, lasts 8 hours, and is `Secure` when the request is served over https.
- Credentials live in a mock repository for the assessment. Replace `server/repositories/user.ts` with a real data source and hashed passwords for actual use.
