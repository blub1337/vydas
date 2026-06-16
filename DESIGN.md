# DESIGN.md — vydas.net / ICTrading

## 1. Visual Theme & Atmosphere
- **Design Philosophy**: "Premium trading terminal meets modern SaaS" — professional, data-dense, trustworthy
- **Atmosphere**: Dark, confident, precise. Like a Bloomberg Terminal but approachable
- **Vibe**: Warm dark background, green as the signal color, monospaced data, glass surfaces
- **One-liner**: "A trading dashboard that happens to be a landing page"

## 2. Color Palette & Roles

```css
/* Ground */
--bg-base: #0a0a0f;
--bg-raised: #121212;
--bg-card: #1a1a1a;
--bg-glass: rgba(255,255,255,0.03);

/* Borders */
--border-subtle: rgba(255,255,255,0.06);
--border-hover: rgba(0,216,0,0.15);

/* Text */
--text-primary: #f0f0f0;
--text-secondary: #9ca3af;
--text-muted: #6b7280;

/* Accent (ICTrading Green) */
--accent: #00d800;
--accent-hover: #33ff33;
--accent-glow: rgba(0,216,0,0.25);
--accent-bg: rgba(0,216,0,0.06);
--accent-border: rgba(0,216,0,0.12);

/* Semantic */
--positive: #00d800;
--negative: #f23645;
--warning: #ffc107;
```

## 3. Typography Rules
- **Display**: Inter Tight (weights 600-900) — for headlines, tight letter-spacing -0.02em
- **Body**: Inter (weights 400-600) — for paragraphs, navigation
- **Data**: JetBrains Mono (weights 400-600) — for prices, metrics, tabular data
- **Google Fonts URL**: `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap`
- **Scale**: 0.7rem / 0.8rem / 0.85rem / 0.9rem / 0.95rem / 1rem / 1.2rem / 1.5rem / 2.4rem / 3.8rem
- **NEVER use**: Inter at default weight for display (AI-cliché), system-ui fallback for data

## 4. Component Stylings

### Buttons
- **Primary**: bg `--accent`, color `--bg-base`, radius 8px, padding 14px 32px
  - hover: bg `--accent-hover`, translateY(-2px), box-shadow `0 8px 30px var(--accent-glow)`
  - active: scale(0.98)
  - focus: 2px outline `--accent`, outline-offset 2px
- **Secondary**: bg transparent, border `--border-subtle`, color `--text-secondary`
  - hover: border `rgba(255,255,255,0.15)`, color `--text-primary`
- **Ghost (nav)**: bg transparent, color `--text-muted`
  - hover: color `--text-primary`

### Cards
- bg `--bg-card`, border `--border-subtle`, radius 12px
- hover: border `--accent-border`, transform translateY(-3px)
- Glass variant: bg `--bg-glass`, backdrop-filter blur(20px)

### Navigation
- Fixed top, bg `rgba(10,10,15,0.7)`, backdrop-filter blur(20px)
- border-bottom `--border-subtle`
- height 68px

### Tags/Badges
- bg `--accent-bg`, border `--accent-border`, color `--accent`
- radius 100px, padding 6px 16px

## 5. Layout Principles
- **Grid**: 4px base, spacing scale: 4/8/12/16/20/24/28/32/36/40/48/56/64/80/96
- **Container**: max-width 1200px, padding 0 24px
- **Hero**: 2-column grid (1fr 1fr), gap 80px
- **Sections**: padding 120px 0
- **Review**: 2-column (1.3fr 0.7fr), gap 32px
- **Features**: 3-column grid, gap 16px

## 6. Depth & Elevation
- **Cards**: no shadow, elevation through border only
- **Glass card**: subtle shadow `0 8px 40px rgba(0,0,0,0.3)`
- **Hover lift**: translateY(-3px) with border color change
- **NEVER**: colored shadows, glow effects on non-accent elements

## 7. Animation & Interaction (L2 — Flowing)
- **Hero title**: fadeInUp on load (800ms, ease-out)
- **Cards**: stagger reveal on scroll (IntersectionObserver, 200ms stagger)
- **Hover**: 200ms ease-out transitions on all interactive elements
- **Floating chips**: gentle float animation (6s, ease-in-out infinite)
- **Background orbs**: slow drift (25-30s, ease-in-out infinite)
- **prefers-reduced-motion**: all animations disabled
- **NEVER**: bouncy springs, elastic easings, auto-scroll carousels

## 8. Do's and Don'ts

### Do's
- Use JetBrains Mono for all numeric data (prices, metrics, percentages)
- Keep green accent on < 5% of total pixel area
- Use hairline borders (1px, rgba white 0.06) for card separation
- Maintain 4.5:1 contrast ratio on all text
- Use tabular-nums for price columns
- Show hover states on all clickable elements
- Use backdrop-filter glass effect on the hero card only
- Keep navigation minimal (Review, Features, Trustpilot, CTA)

### Don'ts
- NEVER use purple-pink-blue gradients (AI cliché)
- NEVER use Inter at default weight for display headlines
- NEVER use emoji as icon substitutes (use SVG or text)
- NEVER use rounded corners above 16px
- NEVER use stock photography of people
- NEVER use bouncy or elastic animations
- NEVER use colored shadows or glow effects
- NEVER use more than one accent color (green only)
- NEVER use system-ui font for data/monospaced content
- NEVER use carousels or auto-rotating content

## 9. Responsive Behavior
- **Breakpoints**: 375px / 768px / 1024px / 1440px
- **Mobile (≤900px)**:
  - Hero becomes single column, centered text
  - Nav links collapse (only CTA visible)
  - Review grid becomes single column
  - Features grid becomes single column
  - Floating chips hidden
  - Section padding reduced to 80px
- **Touch targets**: minimum 44×44px
- **No horizontal overflow** at any breakpoint
