import { getArticle, getArticlesByCategory, getCategories } from "@/lib/docs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const categories = getCategories();
  const params: { category: string; slug: string }[] = [];
  
  for (const cat of categories) {
    const articles = getArticlesByCategory(cat.slug);
    for (const article of articles) {
      params.push({ category: cat.slug, slug: article.slug });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  
  if (!article) return { title: 'Not Found' };
  
  return {
    title: `${article.title} | Documentation | Crawlia`,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  
  if (!article) {
    notFound();
  }

  // Remove the H1 title from the markdown content if it's there so we don't duplicate it
  const contentWithoutH1 = article.content.replace(/^#\s+(.+)$/m, '').trim();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <Link href={`/dashboard/documentation/${category}`} className="inline-flex items-center text-sm font-medium text-[var(--color-brand-slate)] hover:text-[#39b54a] transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to category
        </Link>
        <h1 className="text-3xl md:text-5xl font-outfit font-bold text-[var(--color-brand-ink)] tracking-tight">
          {article.title}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
        <article className="prose prose-slate prose-lg max-w-none prose-headings:font-outfit prose-headings:text-[var(--color-brand-ink)] prose-a:text-[#39b54a] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-slate-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contentWithoutH1}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
