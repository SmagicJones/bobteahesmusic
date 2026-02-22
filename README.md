# bobteachesmusic

Website for Bob Teahes — qualified guitar and bass teacher with 15+ years experience. Built with React Router 7, deployed to Netlify.

## Stack

- **Framework** — [React Router 7](https://reactrouter.com/) (SSR)
- **Language** — TypeScript
- **Styling** — Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **Auth** — Firebase Authentication
- **Deployment** — Netlify

## Pages

| Route | Description |
|---|---|
| `/` | Home / hero |
| `/lessons` | Guitar & bass lessons overview |
| `/lessons/guitar` | Guitar lessons detail |
| `/lessons/bass` | Bass lessons detail |
| `/free-stuff` | Free chart downloads (guitar & bass) |
| `/free-stuff/guitar` | Guitar charts |
| `/free-stuff/bass` | Bass charts |
| `/contact` | Contact & booking |

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Build & Preview

```bash
npm run build
npx netlify-cli serve
```

## Environment Variables

Create a `.env` file at the root (never commit this):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

In production, set these in the Netlify dashboard under **Site settings → Environment variables**.

## Deployment

The project deploys automatically via Netlify on push to `main`. Config is in `netlify.toml`.

To deploy manually:

```bash
npm run build
npx netlify-cli deploy --prod
```

## Adding Chart Downloads

Guitar charts live in `app/data/guitar/charts.ts`, bass charts in `app/data/bass/charts.ts`. Each entry follows this shape:

```ts
{
  title: string;       // Chart name
  intro: string;       // Short description
  comment?: string;    // Optional longer note
  download_url: string; // Path to file in /public or external URL
}
```

Drop new PDF/image files in `/public` and add the corresponding entry to the data file.
