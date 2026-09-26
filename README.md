# Cuseum

**Your personal museum of the internet.**

Cuseum is not a bookmark manager. You do not save links here — you put things
you found on the internet on display. Every screen is built so that the exhibit
itself is the loudest thing on the page, and the interface stays quiet.

- Visitor exhibits live in your own browser (IndexedDB).
- Curator authentication is configurable and self-hosted (see [Authentication](#authentication)).
- One small server route exists, and only to read Open Graph metadata from a
  page you explicitly ask about.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also type-checks and lints)
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Deploys to Vercel with no configuration. `app/api/metadata` runs on the Node.js
runtime, which is the default on Vercel.

---

## The rooms

| Room | Numeral | What hangs there |
| --- | --- | --- |
| Music | I | A collection of sounds worth keeping. |
| Web | II | Pages I kept coming back to. |
| Images | III | Pictures that stayed with me. |
| Objects | IV | Things I would keep on a shelf. |
| Archive | V | Records, papers, and things I want to remember. |

Each room presents the same design language a little differently:

- **Music** → album sleeves standing on a low shelf.
- **Images** → matted and framed on a wall.
- **Web** → a small digital display with a thin bezel showing the hostname.
- **Objects** → sitting on a plinth, with a soft shadow under it.
- **Archive** → a sheet of paper laid slightly askew.

Display styles are chosen per exhibit (`frame`, `poster`, `object`, `screen`,
`document`), so a photograph can hang as a poster and a website can be shown as
a document if that is how you want to remember it.

---

## Screens

| Route | Screen | Notes |
| --- | --- | --- |
| `/` | **Lobby** | Wordmark, tagline, the room index, `Take me somewhere`, and one quiet line of information. |
| `/rooms` | Room index | The same list of entrances, on its own page. |
| `/rooms/[room]` | **Room** | A wall of exhibits, hung according to the room. |
| `/exhibit/[id]` | **Exhibit detail** | The artwork at full size with a small museum label beside it. |
| `/exhibit/[id]/edit` | Edit | Adjust the label, or withdraw the exhibit. |
| `/new` | **New exhibit** | Paste a URL, let the museum read it, correct anything it got wrong, then *Add to museum*. |
| `/collection` | **Collection** | Search, filter by room and type, sort, edit, remove. Deliberately secondary. |

Navigation is intentionally tiny: the wordmark, **Rooms**, **Collection**, and
**+ Exhibit**. There is no sidebar and no dashboard.

---

## Data model

```ts
interface Exhibit {
  id: string;
  title: string;
  type: "website" | "image" | "music" | "object" | "memory";
  room: "web" | "images" | "music" | "objects" | "archive";
  url: string;
  imageUrl: string;
  description: string;
  personalNote: string;
  displayStyle: "frame" | "poster" | "object" | "screen" | "document";
  createdAt: number;   // epoch ms
  sample?: boolean;    // true only for the built-in development fixtures
}
```

Storage is a single Dexie database called `cuseum` with one table,
`exhibits`, indexed on `id`, `room`, `type`, and `createdAt` (`lib/db.ts`).

- `lib/repository.ts` — the only module that talks to Dexie.
- `lib/museumStore.ts` — a ~60 line external store plus pure selectors
  (`selectMuseumStats`, `pickRandomExhibit`, `selectExhibitsByRoom`).
  Mutations go through it, so every screen updates from one place.
- `hooks/useMuseum.ts` — reads that store with `useSyncExternalStore`.
  No state management library is used anywhere in the project.

Clearing browser data clears the museum. That is the whole truth about storage
in v0.1.

---

## Project structure

```
app/
  layout.tsx                 fonts, header, footer, screen transition
  page.tsx                   Lobby
  rooms/page.tsx             Room index
  rooms/[room]/page.tsx      Room wall
  exhibit/[id]/page.tsx      Exhibit detail
  exhibit/[id]/edit/page.tsx Edit + withdraw
  new/page.tsx               New exhibit
  collection/page.tsx        Collection
  not-found.tsx              "Not on display"
  api/metadata/route.ts      the only server route
  globals.css                design tokens (@theme) and the few component classes
components/
  MuseumRuntime.tsx          opens IndexedDB once
  site/                      SiteHeader, SiteFooter, PageEnter, Notices
  lobby/                     RoomIndex, TakeMeSomewhere, CollectionPlaque,
                             SampleDataControls
  room/RoomWall.tsx          per-room hanging and spacing
  exhibit/                   Artwork, ExhibitPiece, DetailStage, MuseumLabel,
                             ExhibitDetail, ExhibitForm, ExhibitEditor
  collection/                CollectionBrowser, CollectionRow
  ui/FormBits.tsx            FormRow, ChoiceRow, LookupNote
hooks/useMuseum.ts           useSyncExternalStore over the museum store
lib/                         types, rooms, exhibitFields, format, db,
                             repository, museumStore, metadata, sampleExhibits
public/samples/              artwork for the sample exhibits (SVG)
```

---

## Sample exhibits (development fixtures)

Ten sample exhibits ship with the project so the rooms are not empty the first
time you look at them. They are deliberately kept separate from real data:

- They are **never inserted automatically**. Nothing happens until you press
  *Place a few sample exhibits* at the bottom of the lobby.
- Every record carries `sample: true`, and they all use fixed ids.
- *Withdraw the 10 samples* removes exactly those records in one step and
  touches nothing else.
- Their artwork lives in `public/samples/*.svg`, so the set works offline and
  cannot break when a remote image disappears.

They are defined in `lib/sampleExhibits.ts`.

---

## The one server route

```
GET /api/metadata?url=https://example.com/article
```

Reads what a page says about itself and returns:

```json
{
  "ok": true,
  "url": "https://example.com/article",
  "hostname": "example.com",
  "title": "…",
  "description": "…",
  "imageUrl": "https://…/og.jpg",
  "siteName": "…",
  "error": null
}
```

- Sources, in order: `og:*`, `twitter:*`, `<title>` / `<meta name>`, then a
  title guessed from the URL itself.
- A 9 second timeout, a 500,000 character read cap, and a browser-like
  user-agent.
- Private network hosts (localhost, `10.*`, `192.168.*`, `172.16–31.*`,
  link-local, `*.local`, `::1`) are refused before any request is made.
- It never throws. A failure comes back as `ok: false` with a sentence to show
  the visitor, and the form keeps every field editable by hand.
- If the URL points straight at an image, the image becomes the artwork.

---

## Design notes

The whole visual system is a handful of tokens in `app/globals.css`:

| Token | Value | Used for |
| --- | --- | --- |
| `--color-paper` | `#f4f0e8` | the wall colour of the whole app |
| `--color-paper-deep` / `--color-paper-raised` | `#ebe4d8` / `#fbf9f5` | plates, mats, sheets |
| `--color-ink` | `#191713` | display text and solid buttons |
| `--color-ink-soft` / `--color-ink-muted` | `#45403a` / `#867e70` | descriptions and small information |
| `--color-line` / `--color-line-strong` | `#dad3c6` / `#b8afa0` | every hairline |
| `--color-clay` | `#8b5a3c` | the only accent, used for removal and errors |
| `--font-display` | Cormorant Garamond | titles, room names, labels, notes |
| `--font-sans` | Inter | small information text only |

Rules that are followed everywhere:

- Exhibits are the only things allowed to be visually loud. Interface text is
  10–11px, uppercase, widely tracked, and muted.
- No gradients, no glassmorphism, no rounded card grids, no coloured tags, no
  stat cards. Depth comes from one soft mount shadow and hairlines.
- Spacing is generous and uneven on purpose: walls use wide gaps, and some
  pieces hang a few pixels lower than their neighbours.
- Motion is a 480 ms fade-and-rise on screen change, 300–700 ms colour and
  transform transitions on hover and focus, and a grid-row reveal for extra
  information. Everything collapses under `prefers-reduced-motion: reduce`.
- Remote artwork is rendered with plain `<img>` rather than `next/image`,
  because exhibit images point at arbitrary hosts, are user-supplied, and are
  never part of the build. The `no-img-element` rule is switched off in
  `eslint.config.mjs` with that reason recorded there.

---

## Accessibility

- Landmarks throughout: one `<header>` with a labelled `<nav>`, one `<main>`
  with `id="main"`, one `<footer>`, and a "Skip to the exhibition" link.
- Exactly one `<h1>` per screen; every section has a heading or an `aria-label`.
- Choice rows are real buttons with `aria-pressed`, grouped with `role="group"`
  and an accessible name — and they are fully keyboard operable.
- Hover-only information is also revealed on `:focus-visible`, so nothing is
  reachable by mouse alone.
- Form fields use real labels; the metadata lookup announces itself through
  `role="status"` / `aria-live="polite"`, and failures are recoverable with
  *Try again* or by typing the values in.
- Focus is always visible (`:focus-visible` hairline in ink).
- Reduced motion is respected globally.

---

## Authentication

Cuseum supports configurable Curator authentication. Copy `.env.example` to
`.env`, set the secrets, then run `npm run auth:migrate` before starting the
app.

Authentication methods do not create separate museums or automatically create
separate Curators. Every method converges on one Better Auth user, and
authorization always checks `isCurator(session.user)` server-side.

### Passkey

Recommended.

```env
AUTH_METHODS=passkey
```

Use WebAuthn-compatible authenticators such as:

* 1Password
* Windows Hello
* Apple Passwords
* Google Password Manager
* hardware security keys

### GitHub

```env
AUTH_METHODS=github
```

Requires:

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Email & Password

```env
AUTH_METHODS=password
```

No public sign-up is provided. Email and password credentials are created only
during first-time Curator setup.

### Multiple methods

```env
AUTH_METHODS=passkey,github,password
```

First-time setup is at `/admin/setup` and requires `CURATOR_SETUP_SECRET`.
Open `/api/admin/setup/authorize?secret=YOUR_SECRET` once to begin.

---

## What v0.1 deliberately leaves out

No social features. No AI recommendations. No comments, no followers, no cloud
sync for visitor exhibits, no analytics, no import/export, and no statistics
dashboard. Cuseum v0.1 is meant to be small and finished.


