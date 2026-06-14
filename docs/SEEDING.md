# Seeding the database

The seed creates a demo site from local content in the `seed/` directory. You can run it as an **ecommerce** demo, a **booking** demo, or a **hybrid** demo that includes both shop and booking content.

## Prerequisites

- A `seed/` directory at the project root.
- Product subfolders inside `seed/`, each containing at least one image (see [Seed folder structure](#seed-folder-structure)).
- App running and a root user (seeding is triggered from the admin dashboard).

## Seed folder structure

```
seed/
├── Homepage image.webp          # Optional: hero image for the homepage
├── 6m x 4m Marquee/             # One product per folder (folder name = product title)
│   ├── 1.png
│   ├── 2.jpeg
│   └── cosy-1.jpeg
├── 10m x 15m Marquee/
│   ├── image1.jpg
│   └── image2.png
└── ...
```

- **Subfolders** = one product each. Folder name becomes the product title and slug (e.g. `6m x 4m Marquee` → slug `6m-x-4m-marquee`). All images inside (`.jpg`, `.jpeg`, `.png`, `.webp`) become the product gallery in sorted order.
- **Root image** = optional hero for the homepage. A file whose name contains `homepage` or `hero` is used first; otherwise the first image in the root is used. If none, the first product’s first image is used.

## How to run the seed

1. Log in to the Payload admin (e.g. `/admin`).
2. On the dashboard, use the **Seed as** dropdown to choose:
   - **Ecommerce** – products for sale, with cart, order, and transaction.
   - **Booking** – same products as bookable items, with demo bookings and no carts/orders.
   - **Hybrid** – ecommerce + booking together (products, services, bookings, cart/order/transaction).
3. Click **Seed your database**.
4. Wait for the success message, then open the site (e.g. Home link) to see the demo.

Seeding is done via `POST /next/seed` with body `{ "mode": "ecommerce" }`, `{ "mode": "booking" }`, or `{ "mode": "hybrid" }`. Only root users can call it.

## CLI usage (repeatable deployment)

You can also run seeding directly from terminal:

```bash
pnpm seed:blackoak            # defaults to hybrid
pnpm seed:blackoak hybrid
pnpm seed:blackoak ecommerce
pnpm seed:blackoak booking
```

This requires at least one user account in the database (typically your root account).

## What the seed does (both modes)

1. Clears header/footer globals and all seeded collections (categories, media, pages, products, forms, variants, carts, orders, transactions, addresses, **bookings**, etc.).
2. Deletes the demo customer user (`customer@example.com`) if present.
3. Discovers `seed/`: product folders and optional hero image.
4. Creates media from every image (hero + all product images).
5. Creates the **Marquees** category and one **product per folder** (title, slug, gallery, description, price £500).
6. Creates customer `customer@example.com` / `password`, contact form, **Home** and **Contact** pages, and header/footer nav.

## Ecommerce mode only

- Customer addresses (UK).
- One succeeded transaction.
- One completed cart and one completed order (first marquee product).

## Booking mode only

- No carts, orders, or transactions.
- Two demo **services** (30 min and 60 min) and two demo **bookings** (one confirmed, one pending) for tomorrow and the day after.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Seed directory "seed" not found` | Create a `seed/` folder at the project root and add at least one product subfolder with images. |
| `Seed directory contains no product folders with images` | Ensure subfolders contain only image files (`.jpg`, `.jpeg`, `.png`, `.webp`). |
| `No images available for homepage` | Add at least one image in a product folder (or a root hero image). |
| 403 on seed | You must be logged in as a root user. |
| Revalidation errors in logs | Normal when seeding; the app may not be running for revalidation. |

## Technical notes

- Seed logic lives under `src/endpoints/seed/`: `discover.ts` (folder scan), `localFile.ts` (read file for media), `marquee-product.ts` (product payload builder), and `index.ts` (main flow and mode branching).
- Mode can be passed in the request body or defaults from `getSiteConfig().projectType` (e.g. `PROJECT_TYPE=booking` → booking mode).
- Bookings have an optional `product` relationship so each booking can reference a marquee product.
