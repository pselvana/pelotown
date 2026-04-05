# Design System Document: High-End Fitness Interface

## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Pulse"**

This design system is built to transform the exercise bike experience from a passive screen to an immersive, high-performance environment. We reject the "standard dashboard" aesthetic in favor of a signature editorial layout that feels both professional and exhilarating. 

The visual language is driven by **"The Kinetic Pulse"**—a philosophy that balances deep, immersive voids (using `background: #0b0e14`) with high-energy, electric highlights. We break away from rigid, boxy templates by utilizing intentional asymmetry, varying component scales, and "floating" interactive layers. The interface doesn't just display data; it creates a rhythmic space where breathing room (whitespace) and bold typography drive the user’s physical momentum.

---

## 2. Colors: Tonal Depth & High-Visibility
Our palette is anchored in a midnight charcoal, providing a high-contrast stage for vibrant electric blues and corals.

*   **Primary (`#97a9ff`):** The "Electric Blue" used for primary actions and active progress.
*   **Secondary (`#ff716c`):** The "Coral" accent, reserved for high-intensity cues, heart rate zones, or "stop/end" actions.
*   **Tertiary (`#ffa3e9`):** A soft magenta for secondary metrics or achievement notifications.

### The "No-Line" Rule
To maintain a premium feel, **1px solid borders are strictly prohibited** for sectioning. We define boundaries exclusively through:
1.  **Tonal Shifts:** Placing a `surface-container-low` component on a `background` surface.
2.  **Negative Space:** Using a minimum of `2rem` (xl) spacing between logical groups.
3.  **Soft Transitions:** Subtle gradients that guide the eye without creating a hard visual "stop."

### Surface Hierarchy & Nesting
Treat the UI as physical layers of depth:
*   **Level 0 (Background):** The "void" where the workout begins.
*   **Level 1 (Surface-Container-Low):** For global navigational elements.
*   **Level 2 (Surface-Container-High):** For interactive cards and live-tracking widgets.
*   **Glassmorphism:** For overlays or modals, use `surface-bright` at 60% opacity with a `24px` backdrop-blur to allow the vibrant workout backgrounds to bleed through.

### Signature Textures
Apply a subtle linear gradient to main CTAs (e.g., `primary` to `primary-container`) to provide a "machined" look that feels more expensive than flat color fills.

---

## 3. Typography: Editorial Authority
We use **Lexend** across all scales. Its geometric nature provides maximum readability from a distance—essential for a moving rider.

*   **Display (lg/md/sm):** Used for the "Hero Metric" (e.g., Output, Cadence). These should be massive and unapologetic.
*   **Headline (lg/md):** Used for workout titles or section headers. These create the "Editorial" feel.
*   **Body (lg/md):** High-readability weights for descriptions and instructor tips.
*   **Label (md/sm):** Reserved for metadata. Always use high-contrast `on-surface-variant` to ensure they don't disappear into the dark background.

**Hierarchy Note:** Always pair a `display-lg` metric with a `label-md` uppercase caption. The contrast in scale creates an authoritative, modern look.

---

## 4. Elevation & Depth
Elevation is achieved through **Tonal Layering** rather than traditional drop shadows.

*   **The Layering Principle:** To "lift" a card, shift the color from `surface-container` to `surface-container-highest`.
*   **Ambient Shadows:** Use only for critical floating elements (like a "Pause" menu).
    *   *Values:* `0px 20px 40px rgba(0, 0, 0, 0.4)`.
    *   *Color:* Use a tint of the background, never a generic black or grey.
*   **The "Ghost Border" Fallback:** If a component requires a boundary for accessibility (like an input field), use `outline-variant` at **20% opacity**. It should feel like a suggestion of a border, not a fence.
*   **The "Vignette" Effect:** Apply a subtle inner glow or edge-highlight to the workout video container to make the hardware screen feel integrated into the software.

---

## 5. Components

### Buttons
*   **Primary:** High-visibility `primary` background with `on-primary` (deep navy) text. Roundedness: `full`.
*   **Secondary:** `surface-container-highest` with a `primary` Ghost Border. 
*   **States:** On `hover/active`, use a scale transform (1.02x) rather than just a color change to provide a "tactile" feedback loop.

### Cards & Lists
*   **Workout Cards:** Forbid dividers. Use a `surface-container-low` background with a `xl` (1.5rem) corner radius.
*   **Information Density:** Space elements within cards using the `md` (0.75rem) spacing token.
*   **Transitions:** Information within lists should use a subtle vertical shift on load to emphasize the "Pulse" of the system.

### Interaction Chips
*   **Filter Chips:** Use `surface-container-high`. When selected, transition to `primary` with `on-primary` text. Avoid the standard "check" icon; use font-weight and color shifts to signal state.

### Live Metrics (Unique Component)
*   **The Metric Tile:** A large `display-md` value centered over a `label-sm` descriptor. The tile itself should have no background, using the `background` color to let the typography lead the hierarchy.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use extreme whitespace (32px+) between major sections to convey a "premium" feel.
*   **DO** use bold, high-contrast colors for interactive elements (Electric Blue/Coral) against the dark background.
*   **DO** use Lexend's heavier weights for primary data to ensure visibility during high-intensity movement.
*   **DO** use large corner radii (`xl`) for a soft, approachable "fun" aesthetic.

### Don’t
*   **DON’T** use 1px solid dividers or lines to separate content.
*   **DON’T** use "Drop Shadows" as a crutch; rely on tonal background shifts first.
*   **DON’T** use high-transparency text. Ensure all `on-surface` text meets a 4.5:1 contrast ratio against the background.
*   **DON’T** clutter the screen. If a piece of data isn't vital to the ride, hide it or reduce its scale to `label-sm`.

---
*Document produced for internal design review. Adherence to these principles ensures a signature, editorial-grade user experience that defines our brand's digital presence.*