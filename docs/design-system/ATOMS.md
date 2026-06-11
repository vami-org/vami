# Vami Design System — Atom Component Library (Part 1)

This document details the first set of foundational, presentational React UI components (atoms) built for the VAMI developer content platform.

In adherence to the design system specification:

- These atoms do not carry application logic or data-fetching logic.
- They consume the design tokens defined in `tokens.css` via custom utility mappings in Tailwind v4 or direct token style overrides.
- They are designed to facilitate clean theme migrations (light/dark mode) and modular refactoring.

---

## Directory Location

All components are located in:
[apps/web/src/components/atoms/](file:///c:/Users/ABSA00065/Desktop/vami/apps/web/src/components/atoms/)

And can be imported collectively via the barrel exporter:

```javascript
import { VamiText, VamiButton, VamiStack } from "./components/atoms";
```

---

## Typography Atoms

### 1. `VamiText`

A versatile presentational wrapper for all standard paragraph, body, or caption texts.

- **Tag**: Renders a `span` by default. Can be overridden via the `as` prop.
- **Props**:
  - `variant`: Color theme. Options: `primary` (`text-ink-800`), `secondary` (`text-ink-600`), `muted` (`text-ink-400`), `error` (`text-error-500`), `success` (`text-success-500`), `warning` (`text-warning-500`), `info` (`text-info-500`), `white` (`text-surface-white`).
  - `size`: Font scale. Options: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`.
  - `weight`: Font weights. Options: `regular`, `medium`, `semibold`, `bold`, `extrabold`.
  - `align`: Alignment. Options: `left`, `center`, `right`, `justify`.
  - `truncate`: Boolean (trims text with ellipses using `truncate block`).
  - `as`: Element tag (e.g. `p`, `span`, `div`, `label`).
  - `className`: Custom style overrides.
- **Example**:
  ```jsx
  <VamiText variant="secondary" size="sm" weight="medium">
    Sub-text content
  </VamiText>
  ```

### 2. `VamiHeading`

Standardizes the visual scale and markup for all page titles and subsections from H1 to H6.

- **Tag**: Renders an `h1` to `h6` based on the `level` prop, unless overridden by the `as` prop.
- **Props**:
  - `level`: Heading scale level `1` (default) to `6`.
  - `size`: Semantic override. Options: `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`. Default maps to the `level` (e.g., level 1 maps to `text-4xl`).
  - `weight`: Options: `regular`, `medium`, `semibold`, `bold` (default), `extrabold`.
  - `as`: Element tag override.
  - `className`: Style additions.
- **Example**:
  ```jsx
  <VamiHeading level={2} size="3xl" weight="extrabold">
    Section Title
  </VamiHeading>
  ```

### 3. `VamiCaption`

A small presentational text block optimized for secondary indicators, metadata, labels, and image caption texts.

- **Props**:
  - `as`: Tag override (default is `span`).
  - `className`: Style overrides (adds `text-xs text-ink-400 font-ui`).
- **Example**:
  ```jsx
  <VamiCaption>Published 2 hours ago</VamiCaption>
  ```

### 4. `VamiLabel`

Standardizes form labels for consistent user interface input fields.

- **Props**:
  - `htmlFor`: Linking ID identifier.
  - `className`: Style overrides (adds `text-sm font-semibold text-ink-800 font-ui mb-1 block`).
- **Example**:
  ```jsx
  <VamiLabel htmlFor="email">Email Address</VamiLabel>
  ```

### 5. `VamiCode`

Monospace code snippet display wrapper.

- **Props**:
  - `className`: Style overrides (adds `font-mono text-sm bg-surface-sunken text-ink-900 px-1.5 py-0.5 rounded border border-border-default`).
- **Example**:
  ```jsx
  <VamiCode>const message = "Vami";</VamiCode>
  ```

---

## Interactive Atoms

### 6. `VamiButton`

Universal action buttons providing primary branding accents, borders, loading spin states, and outline focuses.

- **Props**:
  - `variant`: Action variations. Options: `primary` (black background), `secondary` (bordered white), `ghost` (transparent highlight), `danger` (red theme), `link` (amber inline link).
  - `size`: Height scale. Options: `sm`, `md`, `lg`.
  - `isLoading`: Boolean (swaps children with animated SVG spinner, disables interaction).
  - `disabled`: Boolean (fades opacity and disables events).
  - `onClick`: Event callback function.
  - `type`: Button behaviors (e.g., `button`, `submit`, `reset`).
  - `className`: Style classes.
- **Example**:
  ```jsx
  <VamiButton variant="primary" size="md" isLoading={submitting}>
    Save Profile
  </VamiButton>
  ```

### 7. `VamiIconButton`

Circular button housing an icon-only interactive child (e.g., emojis, SVG icons).

- **Accessibility Safety**: Asserts that `aria-label` or `aria-labelledby` is passed. If missing in development (`import.meta.env.DEV`), triggers a warning in the browser console.
- **Props**:
  - `variant`: Options: `primary`, `secondary`, `ghost`, `danger`.
  - `size`: Options: `sm`, `md`, `lg`.
  - `isLoading`: Boolean (shows spinner).
  - `disabled`: Boolean.
  - `onClick`: Event callback function.
  - `aria-label`: Semantic label describing the action.
- **Example**:
  ```jsx
  <VamiIconButton
    variant="ghost"
    aria-label="Settings Cog"
    onClick={openSettings}
  >
    ⚙️
  </VamiIconButton>
  ```

### 8. `VamiLink`

Polymorphic routing link. Seamlessly decides whether to use React Router `<Link>` for internal links or standard HTML `<a>` tags for external domains.

- **Behavior**: Auto-detects external paths starting with `http://`, `https://`, `mailto:`, or `tel:`. Appends secure relational targets (`target="_blank" rel="noreferrer"`) for all external targets.
- **Props**:
  - `to` / `href`: Path coordinates.
  - `external`: Explicit override boolean to force standard anchor rendering.
  - `className`: Style extensions.
- **Example**:
  ```jsx
  <VamiLink to="/dashboard">Go to Dashboard</VamiLink>
  <VamiLink href="https://github.com/vami-org">GitHub Organization</VamiLink>
  ```

### 9. `VamiAvatar`

User profile photo container displaying image thumbnails or initial fallbacks.

- **Props**:
  - `src`: Image source URL.
  - `alt`: Alternate text for readers.
  - `name`: Fallback placeholder. Used to extract initials when the source is broken or loading.
  - `size`: Options: `sm` (32px), `md` (40px), `lg` (96px), `xl` (128px).
  - `className`: Style overrides.
- **Example**:
  ```jsx
  <VamiAvatar src={user.avatarUrl} name={user.displayName} size="lg" />
  ```

---

## Layout and Structural Atoms

These components serve as layout foundations. They map space sizes to `--space-[N]` custom tokens via native style declarations to avoid static class list bloating and support custom variable spaces dynamically.

### 10. `VamiBox`

A generic box utility aligning paddings, margins, shadows, borders, backgrounds, and radiuses.

- **Props**:
  - `padding`: Spacing value (maps to `--space-[value]`).
  - `margin`: Spacing value (maps to `--space-[value]`).
  - `bg`: Background options: `white`, `warm`, `elevated`, `sunken`, `transparent`.
  - `radius`: Border-radius options: `sm`, `md`, `lg`, `xl`, `2xl`, `full`, `none`.
  - `shadow`: Shadow elevation options: `xs`, `sm`, `md`, `lg`, `xl`, `none`.
  - `border`: Border variations: `default`, `strong`, `focus`, `none`.
  - `as`: Element tag (default `div`).
  - `className`: Custom classes.
- **Example**:
  ```jsx
  <VamiBox bg="elevated" padding={4} radius="lg" shadow="sm" border="default">
    Box Contents
  </VamiBox>
  ```

### 11. `VamiStack`

Displays children vertically using an aligned Flexbox column layout.

- **Props**:
  - `gap`: Spacing token gap index (`0` to `24`).
  - `align`: Cross-axis alignment. Options: `start`, `center`, `end`, `stretch` (default).
  - `justify`: Main-axis alignment. Options: `start`, `center`, `end`, `between`, `around`.
  - `as`: Element tag (default `div`).
- **Example**:
  ```jsx
  <VamiStack gap={4} align="center">
    <VamiHeading level={3}>Header</VamiHeading>
    <VamiText>Supporting paragraph text under header</VamiText>
  </VamiStack>
  ```

### 12. `VamiRow`

Displays children horizontally in a Flexbox row layout.

- **Props**:
  - `gap`: Spacing token gap index (`0` to `24`).
  - `align`: Cross-axis alignment. Options: `start`, `center` (default), `end`, `stretch`.
  - `justify`: Main-axis alignment. Options: `start`, `center`, `end`, `between`, `around`.
  - `wrap`: Boolean (enable wrapping wrap elements).
  - `as`: Element tag (default `div`).
- **Example**:
  ```jsx
  <VamiRow gap={3} justify="between">
    <VamiText>Left Aligned Item</VamiText>
    <VamiButton variant="secondary">Action</VamiButton>
  </VamiRow>
  ```

### 13. `VamiGrid`

Arranges grid template columns dynamically.

- **Props**:
  - `cols`: Grid columns count (`1` to `12`).
  - `gap`: Spacing token gap index (`0` to `24`).
  - `as`: Element tag (default `div`).
- **Example**:
  ```jsx
  <VamiGrid cols={3} gap={4}>
    <div>Grid Panel 1</div>
    <div>Grid Panel 2</div>
    <div>Grid Panel 3</div>
  </VamiGrid>
  ```

### 14. `VamiDivider`

Displays horizontal or vertical separator lines.

- **Props**:
  - `orientation`: Options: `horizontal` (default), `vertical`.
- **Example**:
  ```jsx
  <VamiDivider orientation="horizontal" />
  ```

### 15. `VamiSpacer`

Explicit whitespace block expanding to pad visual blocks without using messy margins.

- **Props**:
  - `size`: Space token index (e.g. `2`, `4`, `8`).
  - `axis`: Options: `vertical` (default), `horizontal`.
- **Example**:
  ```jsx
  <VamiSpacer size={8} axis="vertical" />
  ```
