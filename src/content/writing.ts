import type { Article } from './types'

export const articles: Article[] = [
  {
    slug: 'maps-that-ship',
    title: 'Maps that ship: leading GIS inside a product org',
    date: '2025-11-12',
    tags: ['leadership', 'GIS'],
    summary:
      'Placeholder talk notes. How to keep spatial work on the product roadmap instead of a specialist silo.',
    body: `## The trap

WebGIS talent often becomes a guild: tickets in, tiles out. That is comfortable and slow.

## A better default

Treat the map as a **product surface**. Same design system, same a11y bar, same incident practice as the rest of the app.

## What I actually do

- Pair domain experts with full-stack engineers on the same slice
- Put layer state in the URL
- Refuse 3D until 2D is honest

Replace this essay with a real one when you have it.`,
  },
  {
    slug: 'vue-maplibre-deck',
    title: 'Vue + MapLibre + deck.gl without a science project',
    date: '2025-06-03',
    tags: ['Vue', 'MapLibre', 'deck.gl'],
    summary: 'Placeholder. A production-minded overlay stack, and the failure modes I keep seeing.',
    body: `## The stack

MapLibre owns the basemap and interaction. deck.gl owns analysis. Vue owns chrome.

## Rules that save you

1. One map instance; layers are data, not components that remount the GL context.
2. Picking tooltips live in the DOM, not in a canvas bitmap.
3. Reduced motion means no trip playback.

## Why Vue

The overlay dock, time slider, and legend are ordinary Vue. That is a feature. Cartographers should not have to learn a new UI framework to toggle a hexbin.

Placeholder — swap in a conference write-up or internal RFC.`,
  },
  {
    slug: 'when-not-3d',
    title: 'When a globe is the wrong abstraction',
    date: '2024-09-18',
    tags: ['product', '3D'],
    summary: 'Placeholder. 3D is a costume until measurement, legend, and time are solved in 2D.',
    body: `I like a neon globe as much as anyone. I still ship 2D first.

If the user cannot **compare**, **measure**, or **explain**, the camera is theatre.

Use 3D for terrain, massing, and wayfinding in dense sites. Skip it for choropleths, hexbins, and anything that needs a colour legend the size of a novel.

Placeholder closing line for a real anecdote.`,
  },
]

export function articleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug)
}
