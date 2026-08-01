# Crawlia — UI/UX Design System & Style Guide
**Replicating the "Swokei" Structural Design Formula with a Distinct, Premium Palette**

---

## 1. The "Swokei Formula" (Why It Looks Amazing)

You asked for a design that is *similar in layout, style, and structure* to Swokei, but with a **distinct, original color scheme** that sets Crawlia apart in the market. 

When you analyze Swokei, its visual excellence doesn't come from the color green itself—it comes from a 5-part **structural design formula**:

1. **Tinted Canvas Backgrounds:** Never use sterile `#FFFFFF` or harsh grey `#F3F4F6` for the page background. The canvas must be tinted with a 1-2% pastel wash of your primary brand color.
2. **High-Contrast 2-Tone Gradient CTAs:** Primary conversion buttons and brand marks use a vibrant, high-energy lighter shade transitioning into a deep, rich darker shade of the same color family.
3. **Tone-on-Tone Pastel Pills & Badges:** Status tags, active sidebar items, and table badges never use heavy solid backgrounds. They use an ultra-soft 8–10% opacity tint of the brand color with dark/saturated text.
4. **Tactile Surfaces & Diffused Shadows:** White cards (`#FFFFFF`) float above the tinted canvas using generous border radii (`12px` to `16px`), subtle 1px borders, and soft drop-shadows colored with a trace of the brand hue.
5. **Obsidian Dark Mode:** Dark mode is never pure `#000000`. It is a deep obsidian navy/charcoal that retains a subtle undertone of the primary brand color.

---

## 2. Crawlia's Color Palette: "Deep Teal & Forest Green"

For **Crawlia**—an AI-powered website analyzer and automated prospecting platform—we use a premium **Deep Teal & Forest Green** aesthetic (inspired by the SmilePay reference). This palette projects deep tech authority, financial trust, speed, and modern precision.

### Primary Brand & Accent Colors
| Role | Color Name | Hex Code | HSL / RGB | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary CTA / Teal** | Forest Green | `#2C5E57` | `hsl(172, 36%, 27%)` | Primary button gradients, active indicators, AI highlights |
| **Primary Deep** | Deep Teal | `#1F5A54` | `hsl(173, 49%, 24%)` | Button gradient endpoints, text accents, active icons |
| **Brand Gradient** | Forest-to-Teal | `linear-gradient(135deg, #2C5E57 0%, #1F5A54 100%)` | Logos, primary CTA buttons, premium feature badges |
| **Accent Pastel** | Soft Mint Tint | `#E6EFEA` | `hsl(147, 26%, 92%)` | Badge backgrounds, active sidebar item background, card highlights |
| **Accent Slate** | Cool Slate | `#64748B` | `hsl(215, 16%, 47%)` | Secondary text, table sub-labels, inactive icons |

### Light Mode Surfaces & Neutrals
| Role | Hex Code | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F4F7F6` | `bg-[#F4F7F6]` | Global app background, sidebar background |
| **Card / Surface** | `#FFFFFF` | `bg-white` | Widget cards, table containers, modals, dropdowns |
| **Surface Hover / Alt**| `#E6EFEA` | `bg-[#E6EFEA]` | Table row hover, secondary button hover |
| **Border / Divider** | `#E2E8F0` | `border-[#E2E8F0]` | Card borders, table dividers, input borders |
| **Primary Ink (Text)** | `#0F172A` | `text-[#0F172A]` | Headings, primary body text, table titles |
| **Muted Text** | `#64748B` | `text-[#64748B]` | Subtitles, URLs, timestamps, placeholders |

### Dark Mode Surfaces & Neutrals
| Role | Hex Code | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#0B0F19` | `bg-[#0B0F19]` | Global app background in dark mode (Obsidian Navy) |
| **Card / Surface** | `#111827` | `bg-[#111827]` | Widget cards, table containers in dark mode |
| **Surface Hover / Alt**| `#1F2937` | `bg-[#1F2937]` | Table row hover, secondary button hover |
| **Border / Divider** | `#1E293B` | `border-[#1E293B]` | Dark mode borders and separators |
| **Primary Ink (Text)** | `#F8FAFC` | `text-[#F8FAFC]` | Headings and primary text in dark mode |
| **Muted Text** | `#94A3B8` | `text-[#94A3B8]` | Secondary text and labels in dark mode |

### Status & Lifecycle Colors
*   🟢 **Success / Analyzed / Positive:** Background `#D1EAE2`, Text `#2C5E57`, Border `#A3D5C7`
*   🟡 **Warning / In Progress / Pending:** Background `#FEF9C3`, Text `#854D0E`, Border `#FEF08A`
*   🔴 **Error / Bounced / Negative:** Background `#FCE8E8`, Text `#D84C55`, Border `#F9D1D1`
*   🔵 **Info / Draft / Not Contacted:** Background `#F1F5F9`, Text `#475569`, Border `#E2E8F0`

---

## 3. Alternative Theme Option: "Electric Sky & Royal Sapphire"
If you prefer blue/cyan over indigo/violet, you can achieve the exact same Swokei formula by swapping these 4 tokens:
*   **Canvas Background:** `#F0F8FF` (Ultra-light ice blue tint)
*   **Brand Gradient:** `linear-gradient(135deg, #00D2FF 0%, #2563EB 100%)` (Neon Cyan to Royal Sapphire)
*   **Accent Pastel:** `#E0F2FE` (Soft ice blue badge background)
*   **Active Text Color:** `#0284C7` (Sky blue text)

---

## 4. Typography & Hierarchy

We maintain the exact same modern 3-font pairing that gives the reference site its editorial punch:

1.  **Headings & KPI Numbers:** [Outfit](https://fonts.google.com/specimen/Outfit) (Google Font) — Geometric, punchy, modern.
2.  **Body & UI Text:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) or [Inter](https://fonts.google.com/specimen/Inter) — Clean, legible at small sizes.
3.  **Editorial Accents:** [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) (Italic) — Used for "hero" phrases or special callouts.

### Type Scale Specification
| Level | Font Family | Size / Weight | Letter Spacing | Example Use |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title (H1)** | Outfit | `28px` / `800 Bold` | `-0.03em` | `Dashboard`, `Campaign #14` |
| **Section Title (H2)**| Outfit | `20px` / `700 Bold` | `-0.02em` | `Send Performance`, `Recent Replies` |
| **Card Title (H3)** | Outfit | `16px` / `600 SemiBold`| `-0.01em` | `Email Warmup`, `Connected Mailboxes`|
| **Big KPI Number** | Outfit | `36px` / `800 Bold` | `-0.03em` | `368` (Emails Sent), `96%` (Score) |
| **Body Regular** | Plus Jakarta Sans | `14px` / `400 Regular`| `0em` | Table data, email draft body text |
| **UI Label / Button** | Plus Jakarta Sans | `13px` / `600 SemiBold`| `0.01em` | Button labels, table column headers |
| **Badge / Micro Tag**| Plus Jakarta Sans | `12px` / `700 Bold` | `0.02em` | `• analyzed`, `• not contacted` |

---

## 5. UI Component Specifications & Code Snippets

### A. Primary & Secondary Buttons
Notice how the button uses our new **Violet-to-Indigo gradient** while keeping the exact Swokei pill shape and hover elevation.

```html
<!-- Primary Brand CTA Button -->
<button class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] hover:from-[#9F7AEA] hover:to-[#6366F1] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2">
  <span>Open Dashboard</span>
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
</button>

<!-- Secondary / Ghost Action Button -->
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#EEF2FF] hover:border-[#4F46E5]/30 shadow-2xs transition-all duration-150">
  <span>⚙️ Campaign Settings</span>
</button>

<!-- AI Assistant Header Button ("Ask Crawlia") -->
<button class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs text-[#4F46E5] bg-[#EEF2FF] border border-[#8B5CF6]/30 hover:bg-[#E0E7FF] hover:scale-105 transition-all duration-200 shadow-2xs">
  <span class="text-sm">🤖</span>
  <span>Ask Crawlia</span>
</button>
```

---

### B. Cards, Surface Containers & Glassmorphism
Cards use white (`#FFFFFF`) backgrounds on top of our lavender-tinted canvas (`#F5F6FE`), surrounded by a delicate 1px border and a subtle indigo-tinted drop shadow.

```html
<!-- Standard Dashboard KPI Widget Card -->
<div class="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-[0_8px_30px_rgb(79,70,229,0.05)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] transition-all duration-200 flex flex-col justify-between">
  <div class="flex items-center justify-between text-sm font-semibold text-[#64748B]">
    <span>Interested Replies</span>
    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EEF2FF] text-[#4F46E5]">High Intent</span>
  </div>
  <div class="mt-4 flex items-baseline gap-3">
    <span class="font-['Outfit'] text-4xl font-extrabold text-[#0F172A] tracking-tight">12</span>
    <span class="text-xs font-semibold text-[#4F46E5] flex items-center">↑ 24% vs last week</span>
  </div>
</div>
```

---

### C. Status Pills & Badges
Lifecycle tags styled with our indigo/lavender tone-on-tone formula.

```html
<!-- Success / Analyzed / Active Badge -->
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]/15">
  <span class="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse"></span>
  <span>• analyzed</span>
</span>

<!-- Pending / Not Contacted Badge -->
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F1F5F9] text-[#64748B] border border-gray-200">
  <span class="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span>
  <span>• not contacted</span>
</span>

<!-- Score Badge (High Score 8-10) -->
<span class="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#8B5CF6]/15 text-[#4F46E5] border border-[#8B5CF6]/30">
  9.4 / 10
</span>
```

---

### D. Table Layout (Leads & Prospects View)
High data density without clutter, using cool slate borders and lavender row hover states.

```html
<div class="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-[#F5F6FE] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
        <th class="py-3.5 px-6">Lead / Company</th>
        <th class="py-3.5 px-6">Website Score</th>
        <th class="py-3.5 px-6">Campaign</th>
        <th class="py-3.5 px-6">Status</th>
        <th class="py-3.5 px-6 text-right">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-[#E2E8F0] text-sm">
      <tr class="hover:bg-[#EEF2FF]/60 transition-colors group">
        <!-- 3-Line Lead Info Cell -->
        <td class="py-4 px-6">
          <div class="font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">Sarah Jenkins</div>
          <div class="text-xs text-[#64748B]">sarah@relaystudio.com</div>
          <a href="https://relaystudio.com" target="_blank" class="text-[11px] font-semibold text-[#4F46E5] hover:underline inline-flex items-center gap-1 mt-0.5">
            <span>relaystudio.com</span>
            <svg class="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </td>
        <!-- Website Score -->
        <td class="py-4 px-6">
          <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#EEF2FF] text-[#4F46E5]">8.8 / 10</span>
        </td>
        <!-- Campaign Tag -->
        <td class="py-4 px-6">
          <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-[#0F172A]">Relay Studio Outreach</span>
        </td>
        <!-- Status Pill -->
        <td class="py-4 px-6">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4F46E5]">
            <span class="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></span>
            <span>• analyzed</span>
          </span>
        </td>
        <!-- Row Actions -->
        <td class="py-4 px-6 text-right">
          <button class="p-2 rounded-lg hover:bg-gray-100 text-[#64748B] hover:text-[#0F172A] transition-colors" title="Edit Draft">
            ✏️
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### E. Navigation Layout Shell (Sidebar + Header)
*   **Left Sidebar (`w-60` fixed):** Background is `#FFFFFF` (or match canvas `#F5F6FE`). Links have `px-4 py-2.5 rounded-xl font-semibold text-sm text-[#64748B]`.
*   **Active Nav State:** `bg-[#EEF2FF] text-[#4F46E5] font-bold shadow-2xs` with a subtle indigo icon.
*   **Header Bar (`h-16` fixed):** Clean border bottom (`border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md`). Features the persistent credit counter (`⚡ 5,000+ credits`) and AI Assistant button.

---

## 6. Micro-interactions & Motion Guidelines

1.  **Button Hover Elevation:** All primary buttons should use `hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out`.
2.  **Row Highlight on Hover:** In table rows, hovering anywhere on the row should change the background to `hover:bg-[#EEF2FF]/60` and subtly recolor the primary lead name text to `#4F46E5`.
3.  **Active Analysis Shimmer (Skeleton):** When an AI website audit is in progress (Stage 1 to 5), display a pulsating violet/indigo gradient shimmer bar (`animate-pulse bg-gradient-to-r from-[#EEF2FF] via-white to-[#EEF2FF]`) instead of a generic spinning wheel.
4.  **Live Pulse Indicators:** Active campaigns and live mailboxes get a small `animate-ping` or `animate-pulse` dot indicator in electric violet (`#8B5CF6`).

---

## 7. Drop-in Tailwind CSS Configuration (`tailwind.config.js`)

Copy and paste this configuration directly into Crawlia's frontend project:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#1F5A54',
          emerald: '#2C5E57',
          pastel: '#E6EFEA',
          slate: '#64748B',
          canvas: '#F4F7F6',
          ink: '#0F172A',
          border: '#EAF0EE',
        },
        dark: {
          canvas: '#0B0F19',
          surface: '#111827',
          border: '#1E293B',
          ink: '#F8FAFC',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"SFMono-Regular"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft-indigo': '0 8px 30px rgba(79, 70, 229, 0.05)',
        'elevated-indigo': '0 14px 40px rgba(79, 70, 229, 0.12)',
        'card': '0 2px 12px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #8B5CF6 0%, #4F46E5 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #FFFFFF 0%, #F5F6FE 100%)',
      }
    },
  },
  plugins: [],
}
```

### Required Google Fonts (`index.html`)
Include this in your `<head>` tag to load the exact typography stack:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```
