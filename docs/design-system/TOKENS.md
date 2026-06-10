# Vami Design System — Design Tokens

Design tokens are the visual atoms of our design system. They are stored as CSS Custom Properties (variables) in `tokens.css` and can be utilized across the entire web application.

## Category Reference

### Colors

#### Ink Scale (Text and Primary Elements)

- `--color-ink-900`: `#1C1C1E` (Primary headers, dark text, active CTAs)
- `--color-ink-800`: `#2C2C2E` (Standard body text)
- `--color-ink-600`: `#48484A` (Subtitles and secondary text)
- `--color-ink-400`: `#636366` (Disabled / muted states)
- `--color-ink-200`: `#AEAEB2` (Decorative dividers / borders)
- `--color-ink-100`: `#C7C7CC` (Sunken outlines)
- `--color-ink-050`: `#F2F2F7` (Light background contrasts)

#### Amber Accent (Use Sparingly)

- `--color-amber-500`: `#F5A623` (Primary action links, call-to-actions, branding buttons)
- `--color-amber-400`: `#F7B84B` (Amber hover states)
- `--color-amber-100`: `#FEF3DC` (Glow highlights and selection backdrops)

#### Surfaces

- `--color-surface-white`: `#FFFFFF`
- `--color-surface-warm`: `#F9F8F5` (Default page background - warm tone for readability)
- `--color-surface-elevated`: `#FFFFFF` (Cards, drop panels, alerts)
- `--color-surface-sunken`: `#F2F2F2` (Inputs, search blocks, code block backgrounds)

---

## Theming (Dark Mode)

Dark mode is applied by adding a `data-theme="dark"` attribute to the `html` element:

```html
<html data-theme="dark"></html>
```

When this is active:

- Surfaces invert to dark greys (`#1C1C1E`, `#2C2C2E`, etc.).
- Ink values automatically invert so that light text overlays dark backgrounds correctly.
