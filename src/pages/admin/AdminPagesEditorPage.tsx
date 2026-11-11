import React, { useState, useEffect } from 'react';
import { AdminService } from '../../services/adminService';
import { PageContent } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  HelpCircle,
  Mail,
  Shield,
  Truck,
  RotateCcw,
} from 'lucide-react';

const PAGES_LIST = [
  { slug: 'about', title: 'About Us', icon: FileText },
  { slug: 'contact', title: 'Contact Us', icon: Mail },
  { slug: 'faq', title: 'FAQs', icon: HelpCircle },
  { slug: 'shipping', title: 'Shipping Policy', icon: Truck },
  { slug: 'returns', title: 'Return & Exchange Policy', icon: RotateCcw },
  { slug: 'privacy', title: 'Privacy Policy', icon: Shield },
  { slug: 'terms', title: 'Terms & Conditions', icon: FileText },
];

export const AdminPagesEditorPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeSlug, setActiveSlug] = useState('about');
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPage = async (slug: string) => {
    try {
      setLoading(true);
      const data = await AdminService.getPage(slug);
      setPageData(data);
    } catch (err) {
      console.error(err);
      showToast(`Failed to load page content for ${slug}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(activeSlug);
  }, [activeSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;

    setSaving(true);
    try {
      const updated = await AdminService.updatePage(activeSlug, pageData);
      setPageData(updated);
      showToast(`Page "${pageData.title}" updated successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update page', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = () => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      sections: [
        ...pageData.sections,
        {
          heading: 'New Section Heading',
          body: 'Section body description text goes here...',
        },
      ],
    });
  };

  const handleRemoveSection = (index: number) => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      sections: pageData.sections.filter((_, i) => i !== index),
    });
  };

  const handleSectionChange = (index: number, field: 'heading' | 'body', value: string) => {
    if (!pageData) return;
    const updated = [...pageData.sections];
    updated[index][field] = value;
    setPageData({ ...pageData, sections: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-accent-light dark:text-elara-accent-dark">
            Institutional Content
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-0.5">
            Website Page Content Editor
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !pageData}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-60 shadow-sm"
        >
          {saving ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4 text-elara-champagne" />
          )}
          <span>{saving ? 'Saving...' : 'Save Page Changes'}</span>
        </button>
      </div>

      {/* Pages Selector Tabs */}
      <div className="flex space-x-2 border-b border-elara-border-light dark:border-elara-border-dark pb-px overflow-x-auto">
        {PAGES_LIST.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.slug}
              onClick={() => setActiveSlug(p.slug)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                activeSlug === p.slug
                  ? 'border-[#8A4A52] text-[#8A4A52] dark:text-elara-accent-dark dark:border-elara-accent-dark'
                  : 'border-transparent text-elara-text-muted hover:text-elara-text-dark'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{p.title}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Body */}
      {loading || !pageData ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-[#8A4A52] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Main Title & Subtitle Card */}
          <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
              General Header & Cover Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Page Heading Title *
                </label>
                <input
                  type="text"
                  required
                  value={pageData.title}
                  onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark font-serif text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Cover / Hero Image URL
                </label>
                <input
                  type="url"
                  value={pageData.heroImage || ''}
                  onChange={(e) => setPageData({ ...pageData, heroImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                Introductory Subtitle
              </label>
              <textarea
                rows={2}
                value={pageData.subtitle || ''}
                onChange={(e) => setPageData({ ...pageData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark leading-relaxed"
              />
            </div>
          </div>

          {/* Contact Details (if Contact Page) */}
          {activeSlug === 'contact' && pageData.extraData && (
            <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
                Atelier Studio Contact Coordinates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={pageData.extraData.email || ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        extraData: { ...pageData.extraData, email: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Direct Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={pageData.extraData.phone || ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        extraData: { ...pageData.extraData, phone: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Studio Physical Address
                  </label>
                  <input
                    type="text"
                    value={pageData.extraData.address || ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        extraData: { ...pageData.extraData, address: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sections List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                  Page Paragraphs & Sections ({pageData.sections.length})
                </h3>
                <span className="text-xs text-elara-text-muted">
                  Add, edit, or delete individual headers and copy blocks
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#252021] border border-elara-border-light dark:border-elara-border-dark font-semibold uppercase tracking-wider hover:border-elara-accent-light"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            {pageData.sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#252021] rounded-2xl p-5 border border-elara-border-light dark:border-elara-border-dark shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7E9E7] dark:bg-[#302729] text-[#8A4A52] dark:text-elara-accent-dark">
                    Section {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Remove Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={sec.heading}
                    onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Section Content Body
                  </label>
                  <textarea
                    rows={3}
                    value={sec.body}
                    onChange={(e) => handleSectionChange(idx, 'body', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark leading-relaxed text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-elara-border-light dark:border-elara-border-dark">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-60 shadow-sm"
            >
              <Save className="w-4 h-4 text-elara-champagne" />
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

