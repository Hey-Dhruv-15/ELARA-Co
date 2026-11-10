import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, Sparkles, Check } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address');
      return;
    }

    setIsSubscribed(true);
    showToast(
      'Welcome to ELARA & CO.! Use code FIRST10 for 10% off your first purchase.',
      'success',
      'Subscribed'
    );
  };

  return (
    <section className="py-16 sm:py-20 bg-elara-bg-light dark:bg-elara-bg-dark transition-colors relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-[#F7E9E7] via-white to-[#F7E9E7] dark:from-[#252021] dark:via-elara-card-dark dark:to-[#252021] border border-elara-border-light dark:border-elara-border-dark p-8 sm:p-12 text-center shadow-soft dark:shadow-dark-soft">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark flex items-center justify-center text-[#8A4A52] dark:text-[#E4A9AE] mx-auto mb-4 shadow-2xs">
            <Mail className="w-5 h-5" />
          </div>

          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE] block mb-2">
            The Journal &amp; Secret Drops
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium">
            Stay in the Loop.
          </h2>

          <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark max-w-md mx-auto mt-2 leading-relaxed">
            Subscribe to receive private preview access to limited seasonal hampers, artisan
            interviews, and an instant <strong>10% OFF</strong> welcome code.
          </p>

          {isSubscribed ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 max-w-md mx-auto flex items-center justify-center gap-2 text-xs font-medium animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>You're on the list! Check your inbox for your 10% welcome treat.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address..."
                  className={`flex-1 px-4 py-3 rounded-xl bg-white dark:bg-elara-bg-dark border ${
                    error
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-elara-border-light dark:border-elara-border-dark focus:ring-[#8A4A52]'
                  } text-sm text-elara-text-dark dark:text-elara-text-light placeholder-elara-text-muted focus:outline-none focus:ring-2 shadow-2xs`}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm hover:shadow-md shrink-0"
                >
                  Subscribe
                </button>
              </div>
              {error && (
                <p className="text-xs text-rose-500 text-left pl-2 pt-0.5 animate-fade-in">
                  {error}
                </p>
              )}
              <p className="text-[10px] text-elara-text-muted dark:text-elara-text-muted-dark pt-1">
                Zero spam, ever. Unsubscribe with one click anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

