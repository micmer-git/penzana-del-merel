# UI/UX refinement pass — La Penzana del Merel

## Main direction
Shifted the site from a generic brochure feel toward a more editorial, warm, mountain-trattoria identity with stronger hierarchy, richer section pacing, softer but more intentional surfaces, and clearer interaction cues.

## What was improved

### Global system
- Refined typography scale and spacing rhythm
- Stronger visual identity through layered backgrounds, warmer neutrals, and deeper accent contrast
- Improved sticky header behavior and overall page framing
- More polished CTA, chip, card, and section treatments
- Added favicon for a more complete branded shell

### Cross-page consistency
- Aligned hero sections across pages so they feel part of one family
- Improved content width, vertical rhythm, and reveal behavior
- Reduced “template” feeling by introducing more custom section framing and editorial composition
- Harmonized footer/header styling and link treatment

### Home pages (IT / EN)
- Reworked hero composition and supporting content hierarchy
- Better rhythm between story, atmosphere, and action blocks
- Clearer CTA emphasis without making the page feel overly commercial

### Story / History pages
- Fixed the hero/content presentation so the page opens with a stronger narrative block
- Improved readability and section transitions

### Family / Territory / Gallery / Contact pages
- More distinctive section wrappers and card treatments
- Better visual separation between informational content and action content
- Cleaner gallery/contact layouts with more deliberate spacing

### Menu and order flow
- Refined menu hero and metadata strip
- Improved menu cards and add-to-cart affordances
- Restyled the order-mode popup so it feels more intentional and premium
- Added a clearer popup header, close action, and better first-step explanation
- Added contextual cart copy to clarify whether the order is for table service or delivery
- Added close-on-Escape support for the order modal
- Improved cart bar / cart drawer visual polish and hierarchy

## Files touched
- src/layouts/BaseLayout.astro
- src/components/Header.astro
- src/components/Footer.astro
- src/pages/index.astro
- src/pages/en/index.astro
- src/pages/contatti.astro
- src/pages/en/contact.astro
- src/pages/storia.astro
- src/pages/en/history.astro
- src/pages/famiglia.astro
- src/pages/en/family.astro
- src/pages/territorio.astro
- src/pages/en/area.astro
- src/pages/galleria.astro
- src/pages/en/gallery.astro
- src/pages/menu.astro
- src/pages/en/menu.astro
- src/styles/global.css
- public/favicon.svg

## Suggested PR title
UI/UX refinement pass across all pages + menu ordering flow polish

## Suggested PR description
This PR upgrades the website’s visual identity and interaction quality across all major pages, with special attention to consistency, hierarchy, and the order popup/cart experience. The goal was to move away from a generic preset feel and toward a more crafted, editorial restaurant experience.
