import fs from 'fs';
import path from 'path';

export interface DocCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  articleCount: number;
}

export interface DocArticle {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt?: string;
  content: string;
}

const docsDir = path.join(process.cwd(), 'documentation');

// Hardcoded categories to match the requested design perfectly.
export const categoriesList: DocCategory[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Set up your account, run your first campaign, and learn how Crawlia works end-to-end.',
    icon: 'rocket',
    articleCount: 0,
  },
  {
    slug: 'account-billing',
    title: 'Account & Billing',
    description: 'Manage your subscription, credits, invoices, plan changes, and team seats.',
    icon: 'credit-card',
    articleCount: 0,
  },
  {
    slug: 'campaigns',
    title: 'Campaigns & Outreach',
    description: 'Build campaigns, upload leads, set tones, add follow-ups, and track replies.',
    icon: 'mail',
    articleCount: 0,
  },
  {
    slug: 'website-analysis',
    title: 'Website Analysis',
    description: 'How Crawlia reviews sites, scores them, and what each metric means.',
    icon: 'globe',
    articleCount: 0,
  },
  {
    slug: 'email-sending',
    title: 'Email Sending',
    description: 'Connect your inbox, configure sending domains, warmup, and stay out of spam.',
    icon: 'send',
    articleCount: 0,
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Fix common issues with sending, analysis, mailboxes, and integrations.',
    icon: 'wrench',
    articleCount: 0,
  }
];

export function getCategories(): DocCategory[] {
  if (!fs.existsSync(docsDir)) {
    return categoriesList;
  }

  // Calculate actual article counts
  return categoriesList.map(cat => {
    const catPath = path.join(docsDir, cat.slug);
    let count = 0;
    if (fs.existsSync(catPath)) {
      const files = fs.readdirSync(catPath);
      count = files.filter(f => f.endsWith('.md')).length;
    }
    return { ...cat, articleCount: count };
  });
}

export function getCategoryBySlug(slug: string): DocCategory | undefined {
  return getCategories().find(c => c.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): DocArticle[] {
  const catPath = path.join(docsDir, categorySlug);
  if (!fs.existsSync(catPath)) return [];

  const files = fs.readdirSync(catPath);
  const articles: DocArticle[] = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      const slug = file.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(catPath, file), 'utf-8');
      
      // Extract title from first line starting with #
      let title = slug.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1];
      }

      // Extract a short excerpt (first paragraph that has text)
      let excerpt = '';
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        // Skip empty lines, headings, and images
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('![') && !trimmed.startsWith('<')) {
          excerpt = trimmed.length > 150 ? trimmed.substring(0, 150) + '...' : trimmed;
          break;
        }
      }

      articles.push({
        slug,
        categorySlug,
        title,
        excerpt,
        content
      });
    }
  }

  return articles;
}

export function getArticle(categorySlug: string, articleSlug: string): DocArticle | null {
  const filePath = path.join(docsDir, categorySlug, `${articleSlug}.md`);
  if (!fs.existsSync(filePath)) return null;

  let content = fs.readFileSync(filePath, 'utf-8');
  let title = articleSlug.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1];
  }

  // Pre-process local image links
  // In the MD files, images are linked like `./images/foo.png` or `images/foo.png`
  // We need to rewrite them to `/api/docs/images/[categorySlug]/foo.png`
  content = content.replace(/\]\(\.?\/?images\/([^\)]+)\)/g, `](/api/docs/images/${categorySlug}/$1)`);

  return {
    slug: articleSlug,
    categorySlug,
    title,
    content
  };
}
