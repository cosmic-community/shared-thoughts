# Shared Thoughts - 10,000 Pixel Collaborative Billboard

![App Preview](https://imgix.cosmicjs.com/ea7df920-18a9-11f1-a3e6-0569ca0db350-autopilot-photo-1550684848-fac1c5b4e853-1772725348775.jpeg?w=1200&h=630&fit=crop&auto=format,compress)

A collaborative pixel art experience where 10,000 people each claim a single pixel, color it, and together create one massive shared artwork. Built with Next.js 16 and Cosmic CMS.

## Features

- 🟦 **10,000 Pixel Billboard** — 100×100 grid where each pixel is individually designed by a visitor
- 🔒 **Pixel Locking** — Claimed pixels are locked to prevent duplicate editing
- 🎨 **Mini Pixel Editor** — Beautiful color picker with preset palettes and custom colors
- 🤖 **AI Content Moderation** — Validates pixel submissions to keep the canvas appropriate
- 💾 **Persistent Storage** — Every pixel saved to Cosmic CMS for permanent display
- 📊 **Live Progress** — Real-time progress bar showing billboard completion
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile with zoom/pan controls
- 🌙 **Dark Theme** — Gorgeous dark UI that makes the colorful billboard pop

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=69a9a41b509535b32fefe21b&clone_repository=69a9a56c509535b32fefe245)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create content models for a photography portfolio with photo galleries, collections, an about section, and client testimonials.
>
> User instructions: I want to create a billboard made up of 10,000 pixels that anyone can come to the site, select a pixel to design, have that pixel open up for them to do some basic coloring, and then when they save it saves to the entire 10,000 pixel billboard and then when it's all completed we will have 10,000 individually designd pixels that make up the single image. Ideally we would have ai detection that would prevent anyone from drawing or writting inapropriate content on their pixel. When the user opens up the pixel to edit, that should make it that no one else can select that pixel to prevent duplication. Everythign needs to be saved in the CMS so that when people visit the site again, they can see the art as it's unfolding and then once it's complete."

### Code Generation Prompt

> "Build a Next.js application for a creative portfolio called "Shared thoughts". The content is managed in Cosmic CMS with the following object types: billboard-settings, pixels, pixel-logs. Create a beautiful, modern, responsive design with a homepage and pages for each content type.
>
> I want to create a billboard made up of 10,000 pixels that anyone can come to the site, select a pixel to design, have that pixel open up for them to do some basic coloring, and then when they save it saves to the entire 10,000 pixel billboard and then when it's all completed we will have 10,000 individually designd pixels that make up the single image. Ideally we would have ai detection that would prevent anyone from drawing or writting inapropriate content on their pixel. When the user opens up the pixel to edit, that should make it that no one else can select that pixel to prevent duplication. Everythign needs to be saved in the CMS so that when people visit the site again, they can see the art as it's unfolding and then once it's complete."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Cosmic CMS](https://www.cosmicjs.com/docs) — Headless CMS for content management
- [@cosmicjs/sdk](https://www.npmjs.com/package/@cosmicjs/sdk) — Cosmic JavaScript SDK

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime installed
- A [Cosmic](https://www.cosmicjs.com) account with the billboard content models set up

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd shared-thoughts

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Cosmic credentials

# Run the development server
bun dev
```

### Environment Variables

```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

## Cosmic SDK Examples

### Fetching all pixels
```typescript
const { objects: pixels } = await cosmic.objects
  .find({ type: 'pixels' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1);
```

### Creating a pixel
```typescript
await cosmic.objects.insertOne({
  type: 'pixels',
  title: `Pixel 5-10`,
  metadata: {
    grid_x: 5,
    grid_y: 10,
    pixel_color: '#FF5733',
    pixel_status: 'Designed',
    creator_name: 'Anonymous',
    moderation_status: 'Approved',
  },
});
```

## Cosmic CMS Integration

This app uses three content types:
- **billboard-settings** — Global billboard configuration (grid size, status, moderation)
- **pixels** — Individual pixel data (coordinates, color, status, creator)
- **pixel-logs** — Audit log of all pixel actions

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import the project in [Netlify](https://netlify.com)
3. Set the build command to `bun run build`
4. Add environment variables
5. Deploy!
<!-- README_END -->