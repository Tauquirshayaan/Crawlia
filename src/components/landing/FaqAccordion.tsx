"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqAccordionProps {
  questions: { question: string; answer: string }[];
}

export function FaqAccordion({ questions }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div 
          key={i} 
          className={`bg-slate-50/50 rounded-2xl border ${openIndex === i ? 'border-[#39b54a]' : 'border-slate-200'} shadow-sm overflow-hidden transition-colors`}
        >
          <div 
            className="p-6 cursor-pointer flex justify-between items-center font-bold text-lg hover:bg-slate-100/50 transition-colors"
            onClick={() => toggle(i)}
          >
            {q.question}
            {openIndex === i ? (
              <Minus className="w-6 h-6 text-[#39b54a] shrink-0 ml-4" />
            ) : (
              <Plus className="w-6 h-6 text-[#39b54a] shrink-0 ml-4" />
            )}
          </div>
          {openIndex === i && (
            <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
              {q.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
