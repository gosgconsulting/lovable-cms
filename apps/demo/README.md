# `next` recipe

The `next` recipe showcases one of the most powerful ways to implement Puck using to provide an authoring tool for any route in your Next app.

## Demonstrates

- Next.js 13 App Router implementation
- JSON database implementation with HTTP API
- Catch-all routes to use puck for any route on the platform

## Usage

Run the generator and enter `next` when prompted

```
npx create-puck-app my-app
```

Local environment

1. Create `apps/demo/.env.local` (or copy from `.env.example` if present):

```
NEXT_PUBLIC_SUPABASE_URL=https://mwtndchjmkjrfdziiscd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dG5kY2hqbWtqcmZkemlpc2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDg0NDIsImV4cCI6MjA3MDE4NDQ0Mn0.qK3vZ6zzFdgw-VXHMnBjEV3TgSFG7B7BvIt6am6Mxhk
# Optional server-only keys for privileged server actions
# SUPABASE_SERVICE_ROLE=
# DATABASE_URL=postgresql://postgres:password@db.mwtndchjmkjrfdziiscd.supabase.co:5432/postgres
```

2. Start the server

```
yarn workspace demo dev
```

Navigate to the homepage at https://localhost:3000. To edit the homepage, access the Puck editor at https://localhost:3000/edit.

You can do this for any route on the application, **even if the page doesn't exist**. For example, visit https://localhost:3000/hello/world and you'll receive a 404. You can author and publish a page by visiting https://localhost:3000/hello/world/edit. After publishing, go back to the original URL to see your page.

## Using this recipe

To adopt this recipe you will need to:

- **IMPORTANT** Add authentication to `/edit` routes. This can be done by modifying the example API routes in `/app/api/puck/route.ts` and server component in `/app/[...puckPath]/page.tsx`. **If you don't do this, Puck will be completely public.**
- Integrate your database into the API calls in `/app/api/puck/route.ts`
- Implement a custom puck configuration in `puck.config.tsx`

## License

MIT © [The Puck Contributors](https://github.com/measuredco/puck/graphs/contributors).
