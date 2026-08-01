import { getCategoryBySlug, getArticlesByCategory, getCategories } from "@/lib/docs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, BookOpen, ExternalLink, Rocket, CreditCard, Mail, Globe, Send, Wrench } from "lucide-react";

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const catData = getCategoryBySlug(category);
  if (!catData) return { title: 'Not Found' };
  
  return {
    title: `${catData.title} | Documentation | Crawlia`,
    description: catData.description,
  };
}

const iconMap: Record<string, React.ReactNode> = {
  'rocket': <Rocket className="w-8 h-8 text-white" />,
  'credit-card': <CreditCard className="w-8 h-8 text-white" />,
  'mail': <Mail className="w-8 h-8 text-white" />,
  'globe': <Globe className="w-8 h-8 text-white" />,
  'send': <Send className="w-8 h-8 text-white" />,
  'wrench': <Wrench className="w-8 h-8 text-white" />,
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const catData = getCategoryBySlug(category);
  
  if (!catData) {
    notFound();
  }

  const articles = getArticlesByCategory(category);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Breadcrumb */}
      <div className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/dashboard/documentation" className="flex items-center hover:text-[var(--color-brand-ink)] transition-colors">
          <BookOpen className="w-4 h-4 mr-2" />
          Help Center
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
        <span className="text-[var(--color-brand-ink)] font-semibold">{catData.title}</span>
      </div>

      {/* Header Block */}
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-[#39b54a] rounded-2xl flex items-center justify-center shadow-sm">
          {iconMap[catData.icon] || <Rocket className="w-8 h-8 text-white" />}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-outfit font-bold text-[var(--color-brand-ink)] tracking-tight mb-2">
            {catData.title}
          </h1>
          <p className="text-slate-500 font-medium">
            {articles.length} articles
          </p>
        </div>
      </div>

      {/* Article List */}
      <div className="flex flex-col gap-4">
        {articles.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No articles found in this category.
          </div>
        ) : (
          articles.map((article) => (
            <Link 
              key={article.slug} 
              href={`/dashboard/documentation/${category}/${article.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group relative flex justify-between items-start"
            >
              <div className="pr-12">
                <h3 className="text-base font-bold text-[var(--color-brand-ink)] mb-1.5 font-outfit group-hover:text-[#39b54a] transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </div>
              <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-[#39b54a] transition-colors flex-shrink-0 mt-1" />
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
