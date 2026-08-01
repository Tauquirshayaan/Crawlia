# Crawlia

Crawlia is an AI-powered B2B cold outreach CRM that goes far beyond generic templates. It autonomously analyzes prospect websites, performs multimodal visual critiques, and crafts hyper-personalized cold emails based on actual, observable pain points.

## 🚀 Key Features

- **Autonomous Website Auditing:** A 5-stage pipeline that analyzes a prospect's website before ever writing an email.
- **Multimodal Visual Critique:** Uses Google's Gemini 2.5 Flash to visually inspect Desktop and Mobile screenshots of the prospect's site, grading UX, design hierarchy, and trust signals.
- **Objective Tech & SEO Scoring:** Extracts tech-stack fingerprints (Shopify, WordPress, Webflow, Next.js, etc.) and analyzes Core Web Vitals and SEO metadata.
- **Smart Campaign Engine:** Automatically drops unreachable or low-quality domains (saving credits) and routes the best prospects to the drafting engine.
- **AI Email Drafting:** Translates raw technical findings into business "messaging angles," and drafts a highly personalized email.
- **Native SMTP Sending:** Sends emails directly through the user's connected mailbox (IMAP/SMTP) to ensure maximum deliverability and domain reputation.
- **Reply Categorization:** Syncs replies via IMAP and uses AI to automatically categorize intent (Interested, Info Request, OOO, Unsubscribe).

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Background Jobs / Queues:** [Inngest](https://www.inngest.com/)
- **Browser Automation:** [Playwright](https://playwright.dev/) (Headless rendering & screenshots)
- **AI Models:** Google [Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/flash/) (via `@google/genai`)
- **Email Processing:** `nodemailer`, `imapflow`, and `mailparser`
- **Authentication:** NextAuth.js

## 🧠 The 5-Stage Analysis Flow

When a "Smart" campaign runs, it executes the following pipeline for every lead:

1. **Pre-Check (DNS & HTTP):** Quickly aborts if the domain is unreachable, parked, or blocks traffic, saving compute resources.
2. **Dual-Viewport Render:** Spins up Playwright to capture full 1440px desktop and 390px mobile screenshots.
3. **Objective Signal Extraction:** Parses the DOM for SEO tags (H1s, canonicals, OpenGraph), performance metrics (load time), and tech-stack fingerprints.
4. **Multimodal Visual Critique:** Both screenshots and objective signals are passed to Gemini 2.5 Flash, which acts as a Senior UX Designer, returning 0-10 sub-scores for specific UI/UX categories.
5. **Weighted Composite Scoring:** Combines the data into a final 1-10 Lead Score.
   - Design/UX (35%)
   - SEO (25%)
   - Performance (20%)
   - Mobile Experience (20%)

## 📧 The Outreach Flow

1. **Messaging Angles:** The most severe findings from the analysis (e.g., "Missing social preview tags") are translated into specific sales angles (e.g., "Lost trust when sharing links on LinkedIn").
2. **Email Generation:** Gemini 2.5 drafts a short, punchy cold email using the selected angle and the user's campaign goals.
3. **Delivery:** The email is sent via the user's connected SMTP credentials. The system injects `List-Unsubscribe` headers (for CAN-SPAM compliance) and adds random jitter (time delays) between sends to mimic human behavior and avoid spam filters.
4. **IMAP Sync:** An Inngest cron job periodically checks the connected mailbox. If a reply is detected, Gemini categorizes it (e.g., `INTERESTED`, `OOO`) and updates the dashboard.

## 💻 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file and populate it with your database connection, Gemini API key, and Inngest keys. (See `.env.example` if available).

3. **Database Migration:**
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Start the Inngest Dev Server:**
   In a separate terminal, run Inngest to process background jobs and queues:
   ```bash
   npx inngest-cli@latest dev
   ```
