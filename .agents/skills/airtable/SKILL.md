---
name: airtable
description: "Airtable design system for frontend styling. Use when: building UI components, applying brand styles, choosing colors/typography/spacing, creating buttons/cards/inputs, or implementing responsive layouts with Airtable-inspired aesthetic."
argument-hint: "Describe the UI component or page to style"
---

# Airtable Design System

A clean, enterprise-friendly design system inspired by Airtable's visual language — white canvas, deep navy text, and blue accent CTAs with Swiss-precision typography.

## When to Use

- Styling new UI components or pages
- Choosing colors, fonts, spacing, shadows
- Creating buttons, cards, inputs, or layout sections
- Implementing responsive designs
- Reviewing existing styles for consistency

## 1. Core Tokens (CSS Custom Properties)

Use `--theme_*` naming convention for all CSS variables.

```css
:root {
  /* Text */
  --theme_text-primary: #181d26;
  --theme_text-weak: rgba(4, 14, 32, 0.69);
  --theme_text-secondary-active: rgba(7, 12, 20, 0.82);

  /* Surfaces */
  --theme_surface-primary: #ffffff;
  --theme_surface-light: #f8fafc;
  --theme_button-text-spotlight: rgba(249, 252, 255, 0.97);

  /* Brand */
  --theme_brand-primary: #1b61c9;
  --theme_brand-link: #254fad;

  /* Feedback */
  --theme_success-text: #006400;

  /* Borders */
  --theme_border-default: #e0e2e6;

  /* Shadows */
  --theme_shadow-blue: rgba(0,0,0,0.32) 0px 0px 1px,
                        rgba(0,0,0,0.08) 0px 0px 2px,
                        rgba(45,127,249,0.28) 0px 1px 3px,
                        rgba(0,0,0,0.06) 0px 0px 0px 0.5px inset;
  --theme_shadow-soft: rgba(15, 48, 106, 0.05) 0px 0px 20px;

  /* Spacing (8px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;

  /* Radius */
  --radius-sm: 2px;
  --radius-button: 12px;
  --radius-card: 16px;
  --radius-section: 24px;
  --radius-lg: 32px;
  --radius-circle: 50%;
}
```

## 2. Typography

### Font Stack

```css
--font-primary: 'Haas', -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif;
--font-display: 'Haas Groot Disp', 'Haas', -apple-system, system-ui, sans-serif;
```

### Type Scale

| Role           | Font         | Size | Weight | Line Height | Letter Spacing |
|----------------|--------------|------|--------|-------------|----------------|
| Display Hero   | Haas         | 48px | 400    | 1.15        | normal         |
| Display Bold   | Haas Groot   | 48px | 900    | 1.50        | normal         |
| Section Heading| Haas         | 40px | 400    | 1.25        | normal         |
| Sub-heading    | Haas         | 32px | 400–500| 1.15–1.25   | normal         |
| Card Title     | Haas         | 24px | 400    | 1.20–1.30   | 0.12px         |
| Feature        | Haas         | 20px | 400    | 1.25–1.50   | 0.1px          |
| Body           | Haas         | 18px | 400    | 1.35        | 0.18px         |
| Body Medium    | Haas         | 16px | 500    | 1.30        | 0.08–0.16px    |
| Button         | Haas         | 16px | 500    | 1.25–1.30   | 0.08px         |
| Caption        | Haas         | 14px | 400–500| 1.25–1.35   | 0.07–0.28px    |

**Rule:** Always apply positive letter-spacing to body text (0.07px–0.28px). Never skip it.

## 3. Components

### Buttons

```css
/* Primary CTA */
.btn-primary {
  background: var(--theme_brand-primary);  /* #1b61c9 */
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: 0.08px;
  padding: 16px 24px;
  border-radius: var(--radius-button);     /* 12px */
  border: none;
  cursor: pointer;
}

/* Secondary / White */
.btn-secondary {
  background: #ffffff;
  color: var(--theme_text-primary);        /* #181d26 */
  padding: 16px 24px;
  border-radius: var(--radius-button);
  border: 1px solid #ffffff;
  cursor: pointer;
}

/* Small / Cookie-style */
.btn-small {
  background: var(--theme_brand-primary);
  color: #ffffff;
  border-radius: var(--radius-sm);         /* 2px */
}
```

### Cards

```css
.card {
  background: var(--theme_surface-primary);
  border: 1px solid var(--theme_border-default);  /* #e0e2e6 */
  border-radius: var(--radius-card);               /* 16px */
  box-shadow: var(--theme_shadow-blue);
}

/* Large card variant */
.card-lg {
  border-radius: var(--radius-section);            /* 24px */
}
```

### Shadows

```css
/* Interactive elements — blue-tinted multi-layer */
box-shadow: rgba(0,0,0,0.32) 0px 0px 1px,
            rgba(0,0,0,0.08) 0px 0px 2px,
            rgba(45,127,249,0.28) 0px 1px 3px,
            rgba(0,0,0,0.06) 0px 0px 0px 0.5px inset;

/* Ambient / hover — soft */
box-shadow: rgba(15, 48, 106, 0.05) 0px 0px 20px;
```

## 4. Layout & Spacing

- Base unit: **8px**
- Spacing scale: 4, 8, 12, 16, 24, 32, 40, 48px
- Responsive breakpoints: 425px–1664px range (fluid)

## 5. Do's and Don'ts

### Do

- Use `#1b61c9` (Airtable Blue) for all primary CTAs and interactive links
- Apply Haas font with positive letter-spacing on body text
- Use 12px radius for buttons, 16px+ for cards
- Use blue-tinted multi-layer shadows for interactive depth
- Use `--theme_*` CSS variable naming convention
- Keep backgrounds white (`#ffffff`) or light surface (`#f8fafc`)

### Don't

- Skip positive letter-spacing on body/caption text
- Use heavy drop shadows — keep them subtle and blue-tinted
- Use colors outside the defined palette without justification
- Mix border-radius values inconsistently (follow the radius scale)
- Use Haas Groot Disp for body text (display headings only)

## 6. Quick Reference for Prompts

When generating UI code, apply these defaults:

| Property    | Value              |
|-------------|--------------------|
| Text color  | `#181d26`          |
| CTA color   | `#1b61c9`          |
| Background  | `#ffffff`          |
| Border      | `#e0e2e6`          |
| Font        | Haas, system stack |
| Btn radius  | 12px               |
| Card radius | 16px               |
| Shadow      | Blue-tinted multi-layer |
