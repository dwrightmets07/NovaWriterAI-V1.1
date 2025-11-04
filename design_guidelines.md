# NovaWrite Design Guidelines

## Design Approach: Modern Productivity System

**Selected Approach**: Design System-based, drawing inspiration from Notion's clean interface, Linear's precise typography, and Google Docs' editor-focused layout. The design prioritizes clarity, focus, and professional aesthetics for long-form writing.

**Core Principle**: Create a distraction-free writing environment with intelligent feature placement that doesn't overwhelm the creative process.

---

## Color Palette

### Light Mode
- **Background**: 0 0% 100% (pure white for editor canvas)
- **Surface**: 240 5% 96% (subtle gray for sidebars, dashboard cards)
- **Primary**: 221 83% 53% (confident blue for CTAs, active states)
- **Text Primary**: 222 47% 11% (near-black for optimal readability)
- **Text Secondary**: 215 16% 47% (muted gray for metadata, labels)
- **Border**: 214 32% 91% (soft separator lines)
- **Success** (autosave): 142 76% 36% (green indicator)

### Dark Mode
- **Background**: 222 47% 11% (deep charcoal for editor)
- **Surface**: 217 33% 17% (elevated panels)
- **Primary**: 217 91% 60% (brighter blue for visibility)
- **Text Primary**: 210 40% 98% (crisp white)
- **Text Secondary**: 215 20% 65% (balanced gray)
- **Border**: 217 20% 20% (subtle dark separators)
- **Success**: 142 71% 45% (adjusted green)

### Accent Colors
- **AI Assistant**: 271 91% 65% (vibrant purple for AI features)
- **Warning**: 38 92% 50% (amber for alerts)

---

## Typography

### Font Families
- **Primary (Interface)**: Inter (Google Fonts) - Clean, modern, excellent at all sizes
- **Editor Content**: "Georgia, Merriweather" - Serif stack for comfortable long-form reading
- **Code/Monospace**: "JetBrains Mono" - For any technical content

### Type Scale
- **Hero/Display**: 3rem (48px), font-weight: 700, line-height: 1.1
- **H1 (Editor)**: 2.5rem (40px), font-weight: 600, line-height: 1.2
- **H2 (Editor)**: 2rem (32px), font-weight: 600, line-height: 1.3
- **H3 (Editor)**: 1.5rem (24px), font-weight: 600, line-height: 1.4
- **Body (Editor)**: 1.125rem (18px), font-weight: 400, line-height: 1.7
- **Body (Interface)**: 0.875rem (14px), font-weight: 400, line-height: 1.5
- **Small/Meta**: 0.75rem (12px), font-weight: 500, line-height: 1.4

---

## Layout System

### Spacing Scale
Use Tailwind units: **2, 3, 4, 6, 8, 12, 16, 20** for consistent rhythm
- Tight spacing: p-2, gap-3 (controls, inline elements)
- Standard spacing: p-4, gap-4 (cards, sections)
- Generous spacing: p-6, p-8 (editor padding, major sections)
- Section breaks: py-12, py-16, py-20

### Grid Structure
- **Dashboard**: 3-column grid on desktop (lg:grid-cols-3), 2-col tablet (md:grid-cols-2), 1-col mobile
- **Editor Layout**: Full-width with max-w-4xl centered content area (optimal 65-75 characters per line)
- **Sidebar Width**: 320px (AI Assistant), 280px (navigation/projects)

### Container Widths
- **Dashboard content**: max-w-7xl
- **Editor canvas**: max-w-4xl (optimal reading width)
- **Settings/forms**: max-w-2xl

---

## Component Library

### Navigation & Header
- **Top Bar**: Fixed header with logo (left), document title (center), user avatar + autosave status (right)
- **Height**: h-14 (56px)
- **Background**: Slight blur effect (backdrop-blur-lg) over semi-transparent background
- **Shadow**: Subtle bottom shadow for depth

### Editor Toolbar
- **Position**: Sticky below header when scrolling
- **Style**: Segmented button groups with 1px dividers
- **Icons**: Heroicons (outline for inactive, solid for active states)
- **Size**: 32px icon buttons with rounded-md hover states
- **Grouping**: Typography | Lists | Alignment | Undo/Redo

### Document Cards (Dashboard)
- **Card Design**: Rounded-lg border with hover:shadow-lg transition
- **Content**: Document title (font-semibold, text-base), last edited timestamp (text-sm, text-secondary), word count badge
- **Actions**: Three-dot menu (rename, delete) visible on hover
- **Thumbnail**: 4-line text preview with fade-out gradient

### AI Assistant Sidebar
- **Activation**: Slide-in from right (slide-in animation, not fade)
- **Header**: "AI Assistant" with close button
- **Prompt Area**: Textarea with h-24, rounded-lg, focus ring in primary color
- **Quick Actions**: Chip-style buttons for "Summarize", "Continue", "Rewrite", "Improve"
- **Results**: Dimmed preview card with "Apply" and "Regenerate" buttons
- **Visual Identity**: Subtle purple gradient accent on active state

### Project/Chapter Navigation
- **Sidebar Left**: Collapsible tree structure
- **Project Items**: Folder icon + title, expandable with chevron
- **Chapter Items**: Document icon + title, indented pl-6
- **Active State**: Background highlight (surface color) + left border accent (primary color, 3px)

### Modals & Dialogs
- **Import/Export**: Center-aligned modal, max-w-md
- **File Upload**: Drag-and-drop zone with dashed border, hover state
- **Auth Forms**: Clean, centered with max-w-sm, generous padding (p-8)

### Buttons & CTAs
- **Primary**: bg-primary, text-white, rounded-md, px-6 py-2.5, hover:brightness-110
- **Secondary**: bg-surface, border, hover:bg-border transition
- **Ghost**: text-primary hover:bg-surface (for toolbar)
- **Danger**: bg-red-600 for delete actions

### Status Indicators
- **Autosave**: Small chip with animated dot
  - "Saving...": Pulsing amber dot
  - "Saved": Static green dot with checkmark
- **Position**: Header right, text-xs

### Forms & Inputs
- **Text Input**: border, rounded-md, focus:ring-2 focus:ring-primary, px-3 py-2
- **Dark Mode**: Ensure inputs have visible bg-surface with proper contrast
- **Labels**: text-sm font-medium mb-2 block

---

## Animations & Interactions

**Philosophy**: Minimal, purposeful animations that enhance usability without distraction

- **Page Transitions**: 150ms ease-in-out opacity fade
- **Sidebar Slide**: 200ms ease transform for AI assistant
- **Hover States**: 100ms ease scale-105 for cards, brightness-110 for buttons
- **Autosave Indicator**: Gentle pulse animation (1s duration) on "Saving" state
- **NO animations**: Editor text input, toolbar clicks (instant feedback)

---

## Responsive Breakpoints

- **Mobile (< 768px)**: Single column, collapsible sidebars as drawers, simplified toolbar (icons only)
- **Tablet (768px - 1024px)**: 2-column dashboard, AI sidebar as overlay
- **Desktop (> 1024px)**: Full 3-column dashboard, persistent AI sidebar option

---

## Accessibility & Dark Mode

- **Contrast Ratios**: Minimum 4.5:1 for text, 7:1 for headings
- **Focus States**: 2px ring-primary ring-offset-2 for keyboard navigation
- **Dark Mode Toggle**: Header-right switch with moon/sun icons (Heroicons)
- **Consistent Implementation**: All inputs, editor background, and modals adapt to dark mode

---

## Images & Visual Assets

**Hero Section** (Landing/Marketing Page if applicable):
- Full-width hero (h-screen) showcasing editor interface screenshot with AI sidebar visible
- Overlay: Semi-transparent gradient (primary color, 20% opacity) with centered heading
- Screenshot: Modern browser mockup showing NovaWrite interface with sample document

**Dashboard Empty States**:
- Illustration: Minimalist line-art of a blank document (purple accent color)
- Position: Center of empty project/document list

**Icon Library**: Heroicons (via CDN) for all UI icons - consistent outline style