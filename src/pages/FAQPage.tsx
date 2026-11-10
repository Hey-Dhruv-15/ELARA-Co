import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);
  const [search, setSearch] = useState('');

  const faqs: FAQItem[] = [
    {
      category: 'ordering',
      question: 'How do I place an order for personalized gifts?',
      answer: 'For personalized products like engraved lockets or initial bookmarks, choose your initial or custom text option on the product details page before clicking "Add to Bag". If you have special engraving requests, you can also add a gift note during cart checkout or message our WhatsApp concierge.',
    },
    {
      category: 'ordering',
      question: 'Can I place an order directly on WhatsApp?',
      answer: 'Yes! Simply click the "Order on WhatsApp" button on our checkout page or product pages. It generates a pre-formatted message with your items, pricing, and address to our concierge at +91 98765 43210, who will confirm the order immediately.',
    },
    {
      category: 'shipping',
      question: 'What are the delivery timelines across India?',
      answer: 'Orders are dispatched within 24 to 48 hours from our Indiranagar studio. Metro deliveries (Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Kolkata) typically arrive within 2–3 business days. Non-metro locations take 4–6 business days.',
    },
    {
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: 'Yes! All orders of ₹999 and above qualify for 100% Free Express Insured Shipping. For orders below ₹999, a nominal flat courier fee of ₹79 is applied.',
    },
    {
      category: 'packaging',
      question: 'How are ELARA & CO. items packaged?',
      answer: 'Every gift is wrapped in our signature aesthetic packaging: rigid blush boxes with gold-embossed logos, layered tissue, double-faced champagne silk ribbons, and a handwritten calligraphy card sealed with real sealing wax.',
    },
    {
      category: 'care',
      question: 'How long do the preserved floral bouquets last?',
      answer: 'Our everlasting preserved botanicals and dried bouquets retain their natural soft touch and gentle color for 2 to 3 years without requiring any water or direct sunlight.',
    },
    {
      category: 'returns',
      question: 'What is your return and exchange policy?',
      answer: 'We offer a 7-day hassle-free return window for non-personalized boutique items in original unused condition. Custom engraved or personalized pieces cannot be returned unless damaged in transit.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Breadcrumb items={[{ label: 'FAQs' }]} />

        <div className="text-center my-8 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
            Help &amp; Guidance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark max-w-md mx-auto">
            Find prompt answers regarding orders, packaging, shipping, and bespoke inquiries.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto my-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-elara-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs (e.g. shipping, bouquets, returns)..."
            className="w-full pl-11 pr-4 py-3 text-xs rounded-xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52] shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 justify-center flex-wrap my-6">
          {[
            { id: 'all', label: 'All FAQs' },
            { id: 'ordering', label: 'Ordering & Payment' },
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'packaging', label: 'Packaging' },
            { id: 'care', label: 'Care Guides' },
            { id: 'returns', label: 'Returns' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#8A4A52] text-white font-medium'
                  : 'bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-muted hover:text-elara-text-dark'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3 my-8">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                className="bg-white dark:bg-elara-card-dark rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-normal text-elara-text-dark dark:text-elara-text-light"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8A4A52] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed border-t border-elara-border-light/50 dark:border-elara-border-dark pt-3 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

