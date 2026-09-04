# Seeding the database

The seed creates the **Black Oak Coffee Co.** hybrid demo (shop + booking) from local content in the `seed/` directory.

> **Warning:** Full seed runs are destructive — they clear demo collections and globals before repopulating. Only run when starting fresh or when you can afford to lose current demo data.

## Prerequisites

- A `seed/` directory at the project root with the required product image folders (see below).
- Optional `seed/services/` images for workshop listings.
- At least one admin user in the database (`pnpm create:admin`).

## Seed folder structure

```
seed/
├── homepage-hero.png                    # Optional homepage hero
├── black-oak-pack-bestseller-bundle/   # Product gallery images
├── black-oak-pack-black-bart/
├── black-oak-pack-duomo-and-heartwood-coffee-roasters/
├── black-oak-pack-chamomile-lemongrass/
├── black-oak-pack-earl-grey/
├── black-oak-pack-ceylon-black/
├── black-oak-pack-kyoto-sencha-green/
├── black-oak-pack-artisan-green-tea-bundle/
├── black-oak-pack-yin-hao-jasmine/
├── black-oak-pack-meadow/
└── services/                          # Optional service hero images
    ├── coffee-tasting-experience.jpg
    └── ...
```

- **Product folders** — folder names must match the `folderName` values in `src/endpoints/seed/index.ts`. Images inside (`.jpg`, `.jpeg`, `.png`, `.webp`) become product galleries.
- **Root hero** — a file whose name contains `homepage` or `hero` is preferred; otherwise the first root image is used.

## Commands

| Command | What it does |
|---------|----------------|
| `pnpm seed` | Full hybrid demo: new marketing home, block showcase, products, services, orders, bookings, theme palettes |
| `pnpm seed:legacy` | Same as `pnpm seed`, but restores the previous homepage layout (`home-legacy.ts`) |
| `pnpm seed:theme-palettes` | Upserts system theme palettes only — does **not** wipe pages, products, or other content |

### Admin dashboard

Log in to Payload admin, open the dashboard, and click **Seed your database**. This runs the same full hybrid seed as `pnpm seed` (new marketing home + `/block-showcase`).

For the legacy homepage backup, use `pnpm seed:legacy` from the CLI.

## What the full seed creates

1. Clears header/footer globals and seeded collections (categories, media, pages, products, forms, bookings, etc.).
2. Deletes the demo customer (`customer@blackoakdemo.local`) if present.
3. Loads images from `seed/` and creates media records.
4. Creates coffee/tea **categories**, **products**, **services**, contact form, and pages:
   - **Home** (marketing layout, or legacy layout with `seed:legacy`)
   - **Block showcase** (`/block-showcase`)
   - About, Contact, Blog, marketing pages, brew guides
5. Demo customer, addresses, cart, order, and sample bookings.
6. Header/footer nav and theme palettes.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Seed directory "seed" not found` | Create a `seed/` folder at the project root with required product folders. |
| `Seed is missing required product image folders` | Add the `black-oak-pack-*` folders listed in `productSeeds` inside `src/endpoints/seed/index.ts`. |
| `No images available for homepage` | Add `homepage-hero.png` or images in a product folder. |
| `No user found` (CLI) | Run `pnpm create:admin` first. |
| 403 on admin seed | You must be logged in as an admin user. |
| Home page 404 before seeding | Run `pnpm seed` once. |

## Technical notes

- Seed logic: `src/endpoints/seed/` (`index.ts`, `home.ts`, `home-legacy.ts`, `block-showcase.ts`, etc.).
- CLI entry: `src/scripts/seed-demo.ts`.
- Admin/API: `POST /next/seed` with optional body `{ "homeLayout": "legacy" }` (defaults to showcase).
- Palette-only script: `src/scripts/seed-theme-palettes.ts`.
