import React, { useState, useEffect, useRef } from 'react';
import { AdminService } from '../../services/adminService';
import { HomepageContent } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Upload,
  Save,
  CheckCircle2,
  Eye,
  Link as LinkIcon,
  HelpCircle,
  FileText,
  Volume2,
} from 'lucide-react';

export const AdminHomepagePage: React.FC = () => {
  const { showToast } = useToast();

  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Uploading state
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await AdminService.getHomepageContent();
        setHomepage(data);
      } catch (err) {
        console.error(err);
        showToast('Failed to load homepage content', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepage) return;

    setSaving(true);
    try {
      const updated = await AdminService.updateHomepageContent(homepage);
      setHomepage(updated);
      showToast('Homepage content updated successfully! Reflected live on storefront.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update homepage', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !homepage) return;

    setIsUploadingHero(true);
    try {
      const url = await AdminService.uploadImage(file);
      setHomepage({
        ...homepage,
        hero: { ...homepage.hero, image: url },
      });
      showToast('Hero banner image uploaded!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !homepage) return;

    setIsUploadingStory(true);
    try {
      const url = await AdminService.uploadImage(file);
      setHomepage({
        ...homepage,
        brandStory: { ...homepage.brandStory, image: url },
      });
      showToast('Brand story image uploaded!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploadingStory(false);
    }
  };

  if (loading || !homepage) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#8A4A52] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <input
        ref={heroFileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleHeroUpload}
        className="hidden"
      />
      <input
        ref={storyFileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleStoryUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-accent-light dark:text-elara-accent-dark">
            Storefront Presentation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-0.5">
            Homepage Content Editor
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm disabled:opacity-60"
        >
          {saving ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4 text-elara-champagne" />
          )}
          <span>{saving ? 'Publishing Changes...' : 'Publish Live to Storefront'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* 1. HERO BANNER SECTION */}
        <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-elara-border-light dark:border-elara-border-dark">
            <div className="w-8 h-8 rounded-lg bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                Hero Banner Section
              </h2>
              <span className="text-elara-text-muted">Primary editorial showcase on the landing page</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={homepage.hero.headline}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, headline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark font-serif text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Editorial Subtitle
                </label>
                <textarea
                  rows={3}
                  value={homepage.hero.subtitle}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark leading-relaxed"
                />
              </div>

              {/* Call to Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={homepage.hero.primaryButtonText}
                    onChange={(e) =>
                      setHomepage({
                        ...homepage,
                        hero: { ...homepage.hero, primaryButtonText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Primary Link URL
                  </label>
                  <input
                    type="text"
                    value={homepage.hero.primaryButtonLink}
                    onChange={(e) =>
                      setHomepage({
                        ...homepage,
                        hero: { ...homepage.hero, primaryButtonLink: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={homepage.hero.secondaryButtonText}
                    onChange={(e) =>
                      setHomepage({
                        ...homepage,
                        hero: { ...homepage.hero, secondaryButtonText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Secondary Link URL
                  </label>
                  <input
                    type="text"
                    value={homepage.hero.secondaryButtonLink}
                    onChange={(e) =>
                      setHomepage({
                        ...homepage,
                        hero: { ...homepage.hero, secondaryButtonLink: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Hero Banner Image Preview & Upload */}
            <div className="space-y-3">
              <label className="block font-semibold uppercase tracking-wider text-elara-text-muted">
                Hero Image Preview
              </label>
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-elara-border-light dark:border-elara-border-dark bg-gray-100 group">
                <img
                  src={homepage.hero.image}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => heroFileRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Hero Image</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={homepage.hero.image}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, image: e.target.value },
                    })
                  }
                  className="flex-1 px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-[11px]"
                  placeholder="Or enter direct image URL"
                />
                <button
                  type="button"
                  onClick={() => heroFileRef.current?.click()}
                  className="px-3 py-2 rounded-xl border border-elara-border-light dark:border-elara-border-dark flex items-center gap-1 font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingHero ? 'Uploading...' : 'Upload'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PROMOTIONAL ANNOUNCEMENT BAR */}
        <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-elara-border-light dark:border-elara-border-dark">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52]">
                <Volume2 className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                Top Promotional Announcement Bar
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={homepage.announcement.enabled}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    announcement: { ...homepage.announcement, enabled: e.target.checked },
                  })
                }
                className="rounded text-[#8A4A52]"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                Announcement Headline Text
              </label>
              <input
                type="text"
                value={homepage.announcement.text}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    announcement: { ...homepage.announcement, text: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark uppercase tracking-wider text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                Promo Code
              </label>
              <input
                type="text"
                value={homepage.announcement.couponCode}
                onChange={(e) =>
                  setHomepage({
                    ...homepage,
                    announcement: { ...homepage.announcement, couponCode: e.target.value.toUpperCase() },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark font-mono uppercase font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. BRAND STORY SECTION */}
        <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-elara-border-light dark:border-elara-border-dark">
            <div className="w-8 h-8 rounded-lg bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                Brand Philosophy & Story
              </h2>
              <span className="text-elara-text-muted">Boutique storytelling section on the homepage</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Story Headline
                </label>
                <input
                  type="text"
                  value={homepage.brandStory.headline}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      brandStory: { ...homepage.brandStory, headline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark font-serif text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  First Paragraph
                </label>
                <textarea
                  rows={3}
                  value={homepage.brandStory.paragraph1}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      brandStory: { ...homepage.brandStory, paragraph1: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Second Paragraph
                </label>
                <textarea
                  rows={3}
                  value={homepage.brandStory.paragraph2}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      brandStory: { ...homepage.brandStory, paragraph2: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark leading-relaxed"
                />
              </div>
            </div>

            {/* Story Image Preview */}
            <div className="space-y-3">
              <label className="block font-semibold uppercase tracking-wider text-elara-text-muted">
                Brand Image Preview
              </label>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-elara-border-light dark:border-elara-border-dark bg-gray-100">
                <img
                  src={homepage.brandStory.image}
                  alt="Story Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={homepage.brandStory.image}
                  onChange={(e) =>
                    setHomepage({
                      ...homepage,
                      brandStory: { ...homepage.brandStory, image: e.target.value },
                    })
                  }
                  className="flex-1 px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => storyFileRef.current?.click()}
                  className="px-3 py-2 rounded-xl border border-elara-border-light dark:border-elara-border-dark flex items-center gap-1 font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingStory ? 'Uploading...' : 'Upload'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#252021] border border-elara-border-light dark:border-elara-border-dark">
          <span className="text-xs text-elara-text-muted">
            All updates instantly synchronize across desktop, tablet, and mobile customer visitors.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-60"
          >
            <Save className="w-4 h-4 text-elara-champagne" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

