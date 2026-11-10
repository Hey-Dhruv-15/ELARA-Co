import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { useToast } from '../context/ToastContext';
import { BUSINESS_WHATSAPP_CONFIG } from '../utils/whatsapp';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    setIsSent(true);
    showToast('Your message has reached our concierge! We will reply within 24 hours.', 'success');
  };

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Breadcrumb items={[{ label: 'Contact Us' }]} />

        <div className="text-center my-8 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
            We Are Here For You
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium">
            Contact the Studio
          </h1>
          <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark max-w-md mx-auto">
            Have questions about custom gifting, corporate orders, or order tracking? Reach out to our concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 my-10 items-start">
          {/* Contact Details Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs space-y-6">
              <h3 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                Direct Channels
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-[#8A4A52] dark:text-[#E4A9AE] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-elara-text-dark dark:text-elara-text-light block">
                      Email Concierge
                    </span>
                    <a
                      href="mailto:hello@elaraandco.com"
                      className="text-elara-text-muted hover:text-[#8A4A52] transition-colors"
                    >
                      hello@elaraandco.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-elara-text-dark dark:text-elara-text-light block">
                      WhatsApp Quick Help
                    </span>
                    <a
                      href={`https://wa.me/${BUSINESS_WHATSAPP_CONFIG.phoneNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                    >
                      {BUSINESS_WHATSAPP_CONFIG.displayNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-[#8A4A52] dark:text-[#E4A9AE] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-elara-text-dark dark:text-elara-text-light block">
                      Artisan Studio
                    </span>
                    <p className="text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
                      ELARA &amp; CO. Atelier, 14 Olive Tree Lane, Indiranagar, Bengaluru, KA 560038
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-[#8A4A52] dark:text-[#E4A9AE] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-elara-text-dark dark:text-elara-text-light block">
                      Atelier Hours
                    </span>
                    <p className="text-elara-text-muted dark:text-elara-text-muted-dark">
                      Monday to Saturday: 10:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Right */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-soft">
              {isSent ? (
                <div className="text-center py-10 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-elara-text-dark dark:text-elara-text-light">
                    Message Dispatched!
                  </h3>
                  <p className="text-xs text-elara-text-muted max-w-sm mx-auto leading-relaxed">
                    Thank you, {form.name}. Our gifting specialist has received your inquiry and will respond to {form.email} promptly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSent(false);
                      setForm({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="mt-2 text-xs text-[#8A4A52] underline font-medium"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                    Send Us a Message
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Aarav Mehta"
                        className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="aarav@example.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Custom Corporate Hamper / Order Status / Personalization"
                      className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                      How can we help you? *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Share details of your inquiry, date required, or custom ideas..."
                      className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

