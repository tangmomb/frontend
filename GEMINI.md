# Gemini CLI - Project Context: Portfolio

This document provides essential context and guidelines for interacting with the **Portfolio** project. It is intended to be used by Gemini CLI to ensure consistent and high-quality contributions.

## Project Overview

A modern, one-page static portfolio website built with **Next.js 16 (React 19)**, **TypeScript**, and **Tailwind CSS**. The project uses a simplified version of **Shadcn UI** for core components.

- **Purpose:** Showcase professional work in web development, data science, graphic design, video production, and photography.
- **Architecture:** Single-page application (`app/page.tsx`) with data-driven content.
- **Data Source:** Content is managed via JSON files in the `data/` directory.
- **Automation:** Integrated with **n8n** for automated content updates (e.g., from Google Drive to GitHub).
- **Media:** Supports YouTube and Vimeo video embedding and automatic thumbnail generation.

## Key Technologies

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS (`app/globals.css`)
- **Icons:** Lucide React
- **Media Utilities:** Custom Vimeo/YouTube ID and thumbnail extraction (`lib/youtube.ts`)

## Building and Running

- **Install dependencies:** `npm install`
- **Development server:** `npm run dev` (Runs on http://localhost:3000)
- **Build for production:** `npm run build`
- **Start production server:** `npm start`
- **Linting:** `npm run lint`

## Development Conventions

### 1. Data-Driven Content
All portfolio items are stored in `data/*.json`. When adding or modifying projects, edit the corresponding JSON file:
- `data/websites.json`: Web and Data projects.
- `data/designs.json`: Graphic design work.
- `data/videos.json`: Video production/editing.
- `data/photos.json`: Photography gallery.

### 2. Styling & UI Components
- **CSS Variables:** Colors are defined using OKLCH in `app/globals.css`.
- **Custom Button Component:** Located in `components/ui/button.tsx`. It uses custom classes like `button-primary` and `button-outline`. 
- **Consistency Requirement:** As per `instruct.txt`, ensure all category filtering/sorting buttons across different sections maintain a consistent style.
- **Images:** All project images should be placed in `public/images/`. Use the `Image` component from `next/image` for optimization.

### 3. Media Integration
- Videos are automatically processed via `lib/youtube.ts`. 
- Supported platforms: YouTube, Vimeo.
- Thumbnails for videos are fetched dynamically if a valid URL is provided in the JSON data.

### 4. Code Structure
- `app/`: Contains the main layout and the home page.
- `components/ui/`: Contains reusable UI components (Button, Card).
- `lib/`: Utility functions for string manipulation, video processing, etc.
- `public/`: Static assets including SVG icons and the `images/` directory.

## Specific Instructions for Gemini CLI

- **Autonomy:** Work autonomously without seeking permission for standard tasks.
- **Styling:** Adhere strictly to the `globals.css` patterns. Use `cn` from `lib/utils.ts` for class merging.
- **Modifications:** If updating the portfolio content, prioritize editing the JSON files in `data/` unless structural changes to `app/page.tsx` are required.
- **Testing:** Ensure that any UI changes are responsive, as the project uses a grid layout that adapts from 1 to 6 columns.
