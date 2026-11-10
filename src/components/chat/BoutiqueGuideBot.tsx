import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { CATEGORIES } from '../../data/categories';
import { formatINR } from '../../utils/formatters';
import { BUSINESS_WHATSAPP_CONFIG } from '../../utils/whatsapp';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Compass,
  Tag,
  Gift,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Minimize2,
  ChevronRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  quickLinks?: { label: string; to: string }[];
  timestamp: string;
}

export const BoutiqueGuideBot: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const [pageHint, setPageHint] = useState<string>('');
  const [showHintBubble, setShowHintBubble] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine current page metadata
  const getPageContext = () => {
    const path = location.pathname;
    if (path === '/') {
      return {
        title: 'Home & Discover',
        description:
          'Welcome to the ELARA & CO. flagship storefront! Here you can explore our editorial hero banner, 10 aesthetic categories, trending pieces, curated gift collections, and our brand narrative.',
        chips: [
          '📖 Tour this page',
          '🎁 Gifts under ₹499',
          '✨ Best sellers',
          '🏷️ Active coupons',
        ],
      };
    } else if (path.startsWith('/shop')) {
      return {
        title: 'Boutique Catalogue',
        description:
          'You are browsing our complete gift library! Use the filter sidebar on the left to filter by category, price slider (up to ₹2000), curated occasions (Under ₹299, For Her), or sort by popularity/price.',
        chips: [
          '📖 Tour this page',
          '🔍 How do filters work?',
          '🎁 Gifts under ₹299',
          '🌸 Show Bouquets',
        ],
      };
    } else if (path.startsWith('/product/')) {
      const productId = path.split('/')[2];
      const prod = PRODUCTS.find((p) => p.id === productId);
      return {
        title: prod ? `Product: ${prod.name}` : 'Product Details',
        description: prod
          ? `You are viewing ${prod.name} (${formatINR(prod.price)}). Check out the multi-angle gallery, select your variant, test delivery to your PIN code, read verified reviews, or click "Buy Now" for fast checkout!`
          : 'You are on the product details page where you can examine materials, select options, and check shipping.',
        chips: [
          '📖 Tour this page',
          '🚚 How fast is shipping?',
          '🎁 What is the packaging like?',
          '💬 Order this on WhatsApp',
        ],
      };
    } else if (path === '/cart') {
      return {
        title: 'Your Shopping Bag',
        description:
          'Here you can review your chosen gifts, update quantities, track free shipping (free above ₹999!), apply promo code ELARA20 or FIRST10, and add our signature rosewater gift packaging (+₹49).',
        chips: [
          '📖 Tour this page',
          '🏷️ Which coupons work?',
          '📦 How does gift wrap look?',
          '💳 How do I checkout?',
        ],
      };
    } else if (path === '/checkout') {
      return {
        title: 'Checkout & Delivery',
        description:
          'Enter your delivery address for insured courier dispatch, select demo payment preferences, or click "Order on WhatsApp" to place your order directly with our boutique concierge!',
        chips: [
          '📖 Tour this page',
          '📱 How does WhatsApp ordering work?',
          '🚚 Delivery timelines',
        ],
      };
    } else if (path === '/wishlist') {
      return {
        title: 'Saved Wishlist',
        description:
          'Your saved boutique favorites are preserved here. Click "Move to Bag" whenever you are ready to treat yourself or a loved one!',
        chips: ['📖 Tour this page', '🎁 Recommend more gifts'],
      };
    } else if (path === '/about') {
      return {
        title: 'Our Story & Philosophy',
        description:
          'Learn the story behind ELARA & CO.: "A Little More Thought, A Little More Love." We spotlight female artisans, ethical wages, and 100% plastic-free packaging.',
        chips: ['📖 Tour this page', '🌸 Meet our artisans', '🛍️ Start shopping'],
      };
    } else if (path === '/contact') {
      return {
        title: 'Concierge & Studio Contact',
        description:
          'Need custom gifting, bridesmaid favors, or order tracking? You can send a message through the form or chat directly with us on WhatsApp.',
        chips: ['📖 Tour this page', '💬 Chat on WhatsApp', '❓ View FAQs'],
      };
    } else if (path === '/faq') {
      return {
        title: 'Help & FAQs',
        description:
          'Browse common questions about delivery timelines, everlasting preserved florals, return policies, and personalized engravings.',
        chips: ['📖 Tour this page', '🚚 Shipping times', '🌸 Bouquet lifespan'],
      };
    } else {
      return {
        title: 'ELARA & CO. Boutique',
        description:
          'I am Elara, your personal boutique concierge. I can guide you through any page or help you discover the perfect gift!',
        chips: ['📖 Tour this page', '🎁 Find me a gift', '🏷️ Active coupons'],
      };
    }
  };

  const currentContext = getPageContext();

  // Update page hint when route changes
  useEffect(() => {
    const hints: Record<string, string> = {
      '/': 'Exploring our boutique? Tap me to tour our collections! 🌸',
      '/shop': 'Need help filtering or finding gifts under ₹500? Ask me! ✨',
      '/cart': 'Remember to apply code ELARA20 or FIRST10 for savings! 🏷️',
      '/checkout': 'You can also order directly via WhatsApp with 1 click! 💬',
      '/about': 'Discover the story behind our female artisans & craft 🌿',
      '/contact': 'Need help with custom gifting? Ask me anything!',
    };

    const hint = hints[location.pathname] || `I'm here to guide you through ${currentContext.title}!`;
    setPageHint(hint);
    setShowHintBubble(true);

    const timer = setTimeout(() => {
      setShowHintBubble(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'bot',
          text: `Hi there! 🌸 I'm **Elara**, your boutique concierge. Whether you need a guided tour of this page, gift ideas for someone special, or help with promo codes, I'm right here with you!`,
          timestamp: 'Just now',
          quickLinks: [
            { label: 'Explore Catalogue', to: '/shop' },
            { label: 'Bestselling Gifts', to: '/shop?filter=bestseller' },
          ],
        },
      ]);
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Generate automated reply
  const handleBotResponse = (userQuery: string) => {
    const q = userQuery.toLowerCase().trim();
    let replyText = '';
    let links: { label: string; to: string }[] | undefined = undefined;

    if (
      q.includes('tour') ||
      q.includes('what is in this page') ||
      q.includes("what's in this page") ||
      q.includes('about this page') ||
      q.includes('tell me about this page') ||
      q.includes('explain this page')
    ) {
      replyText = `**📍 Page Guide: ${currentContext.title}**\n\n${currentContext.description}`;
      if (location.pathname === '/') {
        links = [
          { label: 'Shop All Categories', to: '/shop' },
          { label: 'Read Brand Story', to: '/about' },
        ];
      } else if (location.pathname.startsWith('/shop')) {
        links = [
          { label: 'Bracelets', to: '/shop?category=handmade-bracelets' },
          { label: 'Bouquets', to: '/shop?category=aesthetic-bouquets' },
          { label: 'Gifts Under ₹499', to: '/shop?collection=under-499' },
        ];
      } else if (location.pathname === '/cart') {
        links = [{ label: 'Proceed to Checkout', to: '/checkout' }];
      }
    } else if (q.includes('coupon') || q.includes('discount') || q.includes('promo') || q.includes('code')) {
      replyText = `✨ **Here are our active boutique promo codes:**\n\n• **FIRST10** — 10% OFF your first boutique purchase.\n• **ELARA20** — 20% OFF on premium orders above ₹999.\n• **BOUTIQUE15** — 15% OFF on orders above ₹499.\n\nYou can apply these directly on the Shopping Bag page!`;
      links = [{ label: 'Go to Bag', to: '/cart' }];
    } else if (
      q.includes('under 299') ||
      q.includes('under 300') ||
      q.includes('cheap') ||
      q.includes('pocket')
    ) {
      replyText = `🌸 **Delightful Gifts Under ₹299:**\n\n1. *Woven Pastel Friendship Cord Trio* (₹279)\n2. *Aesthetic Bubble Cube Soy Candle* (₹249)\n3. *Personalized Leather Keychain* (₹249)\n4. *French Acetate Pastel Hair Claw* (₹249)\n5. *Dewdrop Copper Fairy Lights* (₹299)`;
      links = [{ label: 'View Gifts Under ₹299', to: '/shop?collection=under-299' }];
    } else if (
      q.includes('under 500') ||
      q.includes('under 499') ||
      q.includes('budget') ||
      q.includes('affordable')
    ) {
      replyText = `🎁 **Popular Gifts Under ₹499:**\n\n1. *Seraphina Freshwater Pearl Bracelet* (₹449)\n2. *Little Joys Petite Gift Hamper* (₹499)\n3. *Vintage Brass Wax Seal Stamp Kit* (₹499)\n4. *Crocheted Tulip & Daisy Stem Bunch* (₹499)\n5. *Rainbow Prism Sun-Catcher* (₹449)`;
      links = [{ label: 'View Gifts Under ₹499', to: '/shop?collection=under-499' }];
    } else if (q.includes('under 999') || q.includes('under 1000')) {
      replyText = `👑 **Luxury Keepsakes Under ₹999:**\n\n1. *Eternal Pastel Bloom Preserved Flower Bouquet* (₹899)\n2. *Custom Monogram Vintage Locket* (₹649)\n3. *Gentleman’s Heritage Desk Hamper* (₹999)\n4. *Mystery Aesthetic Treasure Vault Box* (₹799)`;
      links = [{ label: 'View Gifts Under ₹999', to: '/shop?collection=under-999' }];
    } else if (q.includes('whatsapp') || q.includes('wa') || q.includes('chat')) {
      replyText = `📱 **Direct WhatsApp Ordering:**\n\nYou can place any order directly through WhatsApp with our concierge at **${BUSINESS_WHATSAPP_CONFIG.displayNumber}**!\n\nJust click the "Order on WhatsApp" button at checkout, and it automatically drafts your items, address, and gift note.`;
      links = [{ label: 'Go to Checkout', to: '/checkout' }];
    } else if (q.includes('shipping') || q.includes('delivery') || q.includes('how long')) {
      replyText = `🚚 **Shipping Details:**\n\n• **Dispatches:** Within 24 to 48 hours from our Bengaluru atelier.\n• **Metro Delivery:** 2–3 business days.\n• **Rest of India:** 3–5 business days.\n• **FREE Shipping:** On all orders above ₹999! (Otherwise a flat ₹79).`;
      links = [{ label: 'Read Shipping Policy', to: '/shipping' }];
    } else if (q.includes('bouquet') || q.includes('flower') || q.includes('rose')) {
      replyText = `🌾 **About Our Preserved Bouquets:**\n\nOur bouquets are crafted using 100% real botanicals preserved with natural organic glycerin. They **never need water or sunlight**, and they stay radiant and soft for 2 to 3 years!`;
      links = [{ label: 'Explore Bouquets', to: '/shop?category=aesthetic-bouquets' }];
    } else if (q.includes('bestseller') || q.includes('popular') || q.includes('favorite')) {
      replyText = `✨ **Our Top Bestsellers:**\n\n1. *Rosewater & Champagne Indulgence Hamper*\n2. *Seraphina Freshwater Pearl Bracelet*\n3. *Eternal Pastel Bloom Bouquet*\n4. *Vintage Coca-Cola Embossed Glass Tumbler Duo*`;
      links = [{ label: 'Shop Bestsellers', to: '/shop?filter=bestseller' }];
    } else if (q.includes('gift wrap') || q.includes('packaging')) {
      replyText = `🎀 **Signature Gift Packaging (+₹49):**\n\nEvery gift wrap includes our rigid rosewater blush embossed keepsake box, double-faced silk ribbons, and a personalized calligraphy message card sealed with real golden sealing wax! You can enable it in your Shopping Bag.`;
      links = [{ label: 'View Shopping Bag', to: '/cart' }];
    } else if (q.includes('return') || q.includes('refund')) {
      replyText = `🔄 **Hassle-Free Returns:**\n\nWe provide a **7-day return policy** on all non-personalized boutique items in original condition with tags and packaging.`;
      links = [{ label: 'Return Policy', to: '/returns' }];
    } else {
      replyText = `I'm happy to help! 🌸 Would you like me to give you a tour of what's on this **${currentContext.title}** page, show you gifts for a specific occasion, or share our active promo codes?`;
      links = [
        { label: 'Tour This Page', to: '#' },
        { label: 'Boutique Catalogue', to: '/shop' },
      ];
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          quickLinks: links,
          timestamp: 'Just now',
        },
      ]);
    }, 450);
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = (customText || inputText).trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    handleBotResponse(query);
  };

  return (
    <>
      {/* 1. Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
        {/* Floating Page Hint Speech Bubble */}
        {showHintBubble && !isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-2.5 max-w-[220px] sm:max-w-[260px] p-3 rounded-2xl bg-white/95 dark:bg-elara-card-dark/95 backdrop-blur-md shadow-soft-hover border border-elara-border-light dark:border-elara-border-dark text-xs text-elara-text-dark dark:text-elara-text-light cursor-pointer animate-slide-up hover:scale-102 transition-all relative group"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#8A4A52] shrink-0 mt-0.5 animate-pulse-slow" />
              <p className="leading-snug">{pageHint}</p>
            </div>
            {/* Pointer arrow */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-elara-card-dark border-r border-b border-elara-border-light dark:border-elara-border-dark rotate-45" />
          </div>
        )}

        {/* Floating Avatar Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowHintBubble(false);
          }}
          aria-label="Open Elara Boutique Concierge"
          className="relative group p-1 rounded-full bg-gradient-to-tr from-[#D9A6A5] via-[#E8D5B7] to-[#8A4A52] shadow-soft-hover hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-elara-accent-light/30"
        >
          {/* Avatar Image */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white dark:border-elara-card-dark bg-white shadow-inner relative">
            <img
              src="/elara-avatar.jpg"
              alt="Elara - Boutique Concierge"
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Online green indicator status */}
          <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-elara-card-dark shadow-xs" />

          {/* Pulse ring animation */}
          <span className="absolute -inset-1 rounded-full bg-[#D9A6A5]/30 animate-ping opacity-40 pointer-events-none" />
        </button>
      </div>

      {/* 2. Interactive Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] md:w-[410px] h-[560px] max-h-[85vh] bg-white dark:bg-elara-card-dark rounded-3xl shadow-2xl border border-elara-border-light dark:border-elara-border-dark flex flex-col overflow-hidden animate-slide-up">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-[#FFF9F7] via-[#F7E9E7] to-[#FFF9F7] dark:from-[#252021] dark:via-elara-card-dark dark:to-[#252021] border-b border-elara-border-light dark:border-elara-border-dark flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white dark:border-elara-border-dark shadow-xs shrink-0">
                <img
                  src="/elara-avatar.jpg"
                  alt="Elara"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold text-elara-text-dark dark:text-elara-text-light flex items-center gap-1.5">
                  <span>Elara</span>
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider bg-[#8A4A52] text-white px-2 py-0.5 rounded-full">
                    Guide
                  </span>
                </h3>
                <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Always aware of your page</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light hover:bg-white/60 dark:hover:bg-elara-bg-dark transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Page Context Badge Banner */}
          <div className="px-4 py-2.5 bg-elara-bg-light-sec/50 dark:bg-elara-bg-dark-sec/60 border-b border-elara-border-light/60 dark:border-elara-border-dark flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 truncate pr-2">
              <Compass className="w-3.5 h-3.5 text-[#8A4A52] dark:text-[#E4A9AE] shrink-0" />
              <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark truncate">
                Viewing: <strong className="text-elara-text-dark dark:text-elara-text-light">{currentContext.title}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleSendMessage(undefined, 'Tell me about this page')}
              className="text-[10px] font-semibold uppercase tracking-wider text-[#8A4A52] dark:text-[#E4A9AE] hover:underline shrink-0 bg-white dark:bg-elara-card-dark px-2 py-1 rounded-md border border-elara-border-light dark:border-elara-border-dark"
            >
              Tour Page ✨
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-elara-bg-light/40 dark:bg-elara-bg-dark/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <img
                    src="/elara-avatar.jpg"
                    alt="Elara"
                    className="w-7 h-7 rounded-full object-cover object-top border border-elara-border-light shrink-0 mt-0.5"
                  />
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl shadow-2xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#8A4A52] text-white rounded-br-none'
                      : 'bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Optional Quick Link Buttons */}
                  {msg.quickLinks && msg.quickLinks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-elara-border-light/50 dark:border-elara-border-dark/60 flex flex-wrap gap-1.5">
                      {msg.quickLinks.map((link, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (link.to === '#') {
                              handleSendMessage(undefined, 'Tell me about this page');
                            } else {
                              navigate(link.to);
                              setIsOpen(false);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-[11px] font-medium text-[#8A4A52] dark:text-[#E4A9AE] hover:bg-elara-bg-light-sec transition-colors flex items-center gap-1"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="block text-[9px] opacity-60 mt-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Prompt Suggested Chips */}
          <div className="px-3 py-2 bg-white dark:bg-elara-card-dark border-t border-elara-border-light/60 dark:border-elara-border-dark flex gap-1.5 overflow-x-auto no-scrollbar">
            {currentContext.chips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(undefined, chip)}
                className="px-2.5 py-1 rounded-full bg-elara-bg-light-sec/80 dark:bg-elara-bg-dark-sec text-[10px] font-medium text-elara-text-dark dark:text-elara-text-light border border-elara-border-light dark:border-elara-border-dark hover:border-[#8A4A52] shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => handleSendMessage(e)}
            className="p-3 bg-white dark:bg-elara-card-dark border-t border-elara-border-light dark:border-elara-border-dark flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Elara about this page, gifts, or codes..."
              className="flex-1 px-3.5 py-2 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white disabled:opacity-40 transition-colors shadow-2xs shrink-0"
              aria-label="Send query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

