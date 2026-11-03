# MORON Visual Style Guide

## Brand direction

MORON is a quiet luxury leather-goods brand. The visual language is editorial, warm, and considered: refined rather than ornate, with spacious compositions, natural material cues, and understated confidence.

The experience should feel like a well-produced print journal translated to commerce. Product imagery carries most of the visual weight; interface chrome stays restrained.

### Brand traits

- Warm, tactile, and timeless
- Calm rather than promotional
- Crafted and personal, never sterile
- Elegant with small moments of movement

## Reference adaptation

The implemented site translates the reference into a MORON-specific commerce experience rather than reproducing it literally. It combines a restrained announcement bar, centred desktop navigation, a stacked-to-split editorial hero, and an offset two-piece arrivals edit. Interaction details support the same quiet-luxury direction: hover treatments are limited to precise pointers, controls retain visible focus states, touch targets are enlarged, and reduced-motion preferences remove nonessential movement.

## Color system

| Token     | Value     | Purpose                                           |
| --------- | --------- | ------------------------------------------------- |
| `--deep`  | `#241A16` | Primary dark surface, primary buttons, cart count |
| `--ink`   | `#392B24` | Main text and icons                               |
| `--paper` | `#F6F0E7` | Page background                                   |
| `--cream` | `#FFFCF6` | Light panels, header, hero base                   |
| `--sage`  | `#E7DDD0` | Soft supporting surface                           |
| `--sand`  | `#E8D8C6` | Newsletter and warm supporting surface            |
| `--gold`  | `#A87D50` | Focus treatment and small premium accent          |
| `--line`  | `#E1D6CA` | Borders and dividers                              |

Use dark brown as an anchor, not as a dominant page background. Keep large content surfaces light and warm. Gold is an accent: use it for the active/focus signal, not for blocks of body text.

## Typography

| Role                | Typeface         | Guidance                                              |
| ------------------- | ---------------- | ----------------------------------------------------- |
| Display headings    | Playfair Display | Medium weight, tight negative tracking, large scale   |
| Body text           | DM Sans          | Neutral, readable, relaxed line-height                |
| Labels and controls | DM Mono          | Small uppercase labels with deliberate letter spacing |

### Type hierarchy

- **H1:** `clamp(3rem, 10.5vw, 6.1rem)`; Playfair Display; line-height around `0.9`.
- **Hero H1:** `clamp(2.7rem, 5.2vw, 5rem)`; restrained, never more than two lines.
- **H2 / H3:** Playfair Display, medium weight, tight tracking.
- **Eyebrow:** DM Mono, 8px, uppercase, `0.13em` tracking, warm brown.
- **Body:** DM Sans, comfortable 1.6–1.7 line-height.
- **Actions and metadata:** DM Mono, 8–10px, uppercase.

Use sentence case for editorial copy. Use uppercase sparingly for compact navigation, labels, and utility actions.

## Layout and spacing

The layout is mobile-first. Content sections use generous vertical breathing room and modest horizontal page gutters.

- Header: 76px minimum height.
- Mobile page gutter: roughly 5–9% of viewport width.
- Desktop page gutter: roughly 7% of viewport width.
- Editorial sections: 60–78px vertical padding on mobile, increasing on desktop.
- Product grids: two columns on small screens; four columns at 700px and above.
- Main content should stay visually airy; avoid dense cards, excessive borders, or boxed-in content.

## Imagery

Use warm, editorial product imagery with natural textures, quiet shadows, and tactile leather detail.

- Prefer portrait or near-square product framing.
- Product cards use a 4:5 image ratio.
- Keep image backgrounds muted: cream, sand, stone, warm grey, or soft shadow.
- Do not introduce highly saturated colors, hard gradients, or generic stock imagery.
- Decorative texture may be subtle: grain, soft radial warmth, and gentle image overlays are appropriate.

## Component guidance

### Header

The header is a clean light bar with the MORON wordmark on the left, navigation centered on desktop, and utility actions on the right. On mobile, navigation is revealed by a compact menu control.

The wordmark uses Playfair Display with wide tracking; the descriptor uses tiny DM Mono text. Keep it uncluttered.

### Buttons

Primary buttons are dark brown rectangles with small mono uppercase labels and a right-aligned directional arrow.

- Padding: about `13px 16px`.
- Border: 1px solid dark brown.
- Hover: lift 2px and shift to a lighter brown.
- Focus: 2px gold outline with a 3px offset.
- Avoid rounded pill buttons for primary calls to action.

### Product cards

Product cards are image-first, with minimal metadata beneath.

- Show category in small mono text.
- Show product name in Playfair Display.
- Show price in compact mono text.
- Keep badges discreet and positioned inside the image.
- On hover, reveal a secondary image and a quick-add action; maintain this as an enhancement, not a requirement for touch users.

### Filters and search

Search and sort controls should be clear, compact, and quiet. Category filters use small rounded controls; the active state is dark with white text.

### Cart drawer

The cart is a right-side drawer on a cream background. It should feel like an extension of the page, not a separate application. Use clean dividers, small product thumbnails, and a sticky-feeling footer with subtotal and the view-bag action.

### Forms

Inputs are light, bordered, and clearly labeled. Preserve visible labels or screen-reader-only labels where the visual design uses placeholders. Validation messaging is concise and calm.

## Motion

Motion should feel soft, editorial, and purposeful.

- Use opacity and small vertical movement for section reveals.
- Use slow, subtle image scale changes for hero and campaign imagery.
- Use 250–800ms transitions with easing; avoid bouncy or high-energy motion.
- Product interactions can use a small upward lift.
- Respect `prefers-reduced-motion`: remove nonessential animation and preserve readability.

## Responsive behavior

- Begin with the mobile composition; enhance at `min-width: 700px`.
- On mobile, use stacked hero content and image panels, two-column product grids, and hidden hover-only quick actions.
- On desktop, place hero copy and imagery side by side, show full navigation, and expand product grids to four columns.
- Keep touch targets large enough to use comfortably, especially header actions, carousel controls, and quantity controls.

## Accessibility baseline

- Maintain strong text contrast against warm surfaces.
- Keep visible keyboard focus styling.
- Give all icon-only actions accessible names.
- Use descriptive product image alt text; decorative secondary images should be hidden from assistive technology.
- Do not communicate state through color alone.

## Do and do not

**Do** use warm neutrals, ample whitespace, serif editorial typography, and measured movement.

**Do not** add loud gradients, neon accents, heavy shadows, default system-looking controls, rounded-everything UI, or dense dashboard-style layouts.
