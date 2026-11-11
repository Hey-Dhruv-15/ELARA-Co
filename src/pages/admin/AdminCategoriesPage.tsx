import React, { useState, useEffect, useRef } from 'react';
import { AdminService } from '../../services/adminService';
import { Category, GiftCollection, Product } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  Layers,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'categories' | 'collections'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<GiftCollection[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    featured: true,
  });

  // Collection Modal
  const [isCollModalOpen, setIsCollModalOpen] = useState(false);
  const [isEditingColl, setIsEditingColl] = useState(false);
  const [editingCollId, setEditingCollId] = useState<string | null>(null);
  const [collFormData, setCollFormData] = useState<Partial<GiftCollection>>({
    title: '',
    subtitle: '',
    slug: '',
    image: '',
    badge: 'Curated',
    isVisible: true,
    productIds: [],
  });

  // Deletion modals
  const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'collection'; id: string; name: string } | null>(null);

  // Image upload
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<'cat' | 'coll'>('cat');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cats, colls, prods] = await Promise.all([
        AdminService.getCategories(),
        AdminService.getCollections(),
        AdminService.getProducts(),
      ]);
      setCategories(cats);
      setCollections(colls);
      setAllProducts(prods);
    } catch (err) {
      console.error(err);
      showToast('Failed to load categories or collections', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Category handlers
  const handleOpenAddCat = () => {
    setIsEditingCat(false);
    setEditingCatId(null);
    setCatFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      featured: true,
    });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: Category) => {
    setIsEditingCat(true);
    setEditingCatId(cat.id || cat.slug);
    setCatFormData({ ...cat });
    setIsCatModalOpen(true);
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.name) return;

    try {
      if (isEditingCat && editingCatId) {
        const updated = await AdminService.updateCategory(editingCatId, catFormData);
        setCategories((prev) => prev.map((c) => (c.id === editingCatId || c.slug === editingCatId ? updated : c)));
        showToast(`Category "${updated.name}" updated!`, 'success');
      } else {
        const created = await AdminService.createCategory(catFormData);
        setCategories((prev) => [...prev, created]);
        showToast(`Category "${created.name}" created!`, 'success');
      }
      setIsCatModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    }
  };

  // Collection handlers
  const handleOpenAddColl = () => {
    setIsEditingColl(false);
    setEditingCollId(null);
    setCollFormData({
      title: '',
      subtitle: '',
      slug: '',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      badge: 'Curated Elegance',
      isVisible: true,
      productIds: [],
    });
    setIsCollModalOpen(true);
  };

  const handleOpenEditColl = (coll: GiftCollection) => {
    setIsEditingColl(true);
    setEditingCollId(coll.id || coll.slug);
    setCollFormData({ ...coll, productIds: coll.productIds ? [...coll.productIds] : [] });
    setIsCollModalOpen(true);
  };

  const handleSaveColl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collFormData.title) return;

    try {
      if (isEditingColl && editingCollId) {
        const updated = await AdminService.updateCollection(editingCollId, collFormData);
        setCollections((prev) => prev.map((c) => (c.id === editingCollId || c.slug === editingCollId ? updated : c)));
        showToast(`Collection "${updated.title}" updated!`, 'success');
      } else {
        const created = await AdminService.createCollection(collFormData);
        setCollections((prev) => [...prev, created]);
        showToast(`Collection "${created.title}" created!`, 'success');
      }
      setIsCollModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save collection', 'error');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'category') {
        await AdminService.deleteCategory(itemToDelete.id);
        setCategories((prev) => prev.filter((c) => c.id !== itemToDelete.id && c.slug !== itemToDelete.id));
        showToast(`Category "${itemToDelete.name}" deleted`, 'info');
      } else {
        await AdminService.deleteCollection(itemToDelete.id);
        setCollections((prev) => prev.filter((c) => c.id !== itemToDelete.id && c.slug !== itemToDelete.id));
        showToast(`Collection "${itemToDelete.name}" deleted`, 'info');
      }
      setItemToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await AdminService.uploadImage(file);
      if (uploadTarget === 'cat') {
        setCatFormData((prev) => ({ ...prev, image: url }));
      } else {
        setCollFormData((prev) => ({ ...prev, image: url }));
      }
      showToast('Image uploaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 1. Header Bar with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-accent-light dark:text-elara-accent-dark">
            Taxonomy & Curation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-0.5">
            Categories & Collections
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'categories' ? (
            <button
              type="button"
              onClick={handleOpenAddCat}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#723c43] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddColl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#723c43] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Collection</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-elara-border-light dark:border-elara-border-dark pb-px">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'categories'
              ? 'border-[#8A4A52] text-[#8A4A52] dark:text-elara-accent-dark dark:border-elara-accent-dark'
              : 'border-transparent text-elara-text-muted hover:text-elara-text-dark'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Product Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`flex items-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'collections'
              ? 'border-[#8A4A52] text-[#8A4A52] dark:text-elara-accent-dark dark:border-elara-accent-dark'
              : 'border-transparent text-elara-text-muted hover:text-elara-text-dark'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Curated Collections ({collections.length})</span>
        </button>
      </div>

      {/* TAB 1: CATEGORIES GRID */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.slug}
              className="bg-white dark:bg-[#252021] rounded-2xl p-4 border border-elara-border-light dark:border-elara-border-dark shadow-sm flex gap-4 items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80'}
                  alt={cat.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-elara-border-light dark:border-elara-border-dark"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-elara-text-dark dark:text-elara-text-light truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-elara-text-muted truncate block">
                    /{cat.slug}
                  </span>
                  {cat.featured && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#F7E9E7] dark:bg-[#302729] text-[#8A4A52] dark:text-elara-accent-dark text-[9px] font-bold uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEditCat(cat)}
                  className="p-1.5 rounded-lg border border-elara-border-light dark:border-elara-border-dark hover:bg-[#F7E9E7] dark:hover:bg-[#302729]"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete({ type: 'category', id: cat.id || cat.slug, name: cat.name })}
                  className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: COLLECTIONS GRID */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((coll) => (
            <div
              key={coll.id || coll.slug}
              className="bg-white dark:bg-[#252021] rounded-2xl p-4 border border-elara-border-light dark:border-elara-border-dark shadow-sm flex flex-col justify-between"
            >
              <div className="flex gap-3">
                <img
                  src={coll.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80'}
                  alt={coll.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-elara-border-light dark:border-elara-border-dark"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-elara-text-dark dark:text-elara-text-light truncate">
                      {coll.title}
                    </h3>
                    {coll.isVisible === false && (
                      <span className="text-[10px] text-gray-400 font-bold uppercase">(Hidden)</span>
                    )}
                  </div>
                  <span className="text-[11px] text-elara-text-muted truncate block">
                    {coll.subtitle || coll.badge}
                  </span>
                  <span className="text-[10px] text-elara-accent-light mt-1 block">
                    Filter: {coll.filterKey}={coll.filterValue}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-elara-border-light/60 dark:border-elara-border-dark">
                <span className="text-[11px] text-elara-text-muted">
                  Badge: <strong className="text-elara-text-dark dark:text-elara-text-light">{coll.badge || 'None'}</strong>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditColl(coll)}
                    className="p-1.5 rounded-lg border border-elara-border-light dark:border-elara-border-dark hover:bg-[#F7E9E7] dark:hover:bg-[#302729]"
                    title="Edit Collection"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemToDelete({ type: 'collection', id: coll.id || coll.slug, name: coll.title })}
                    className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#252021] rounded-3xl p-6 border border-elara-border-light dark:border-elara-border-dark shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-elara-border-light mb-4">
              <h3 className="font-serif text-xl font-medium">
                {isEditingCat ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsCatModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catFormData.name || ''}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                  Slug (URL identifier)
                </label>
                <input
                  type="text"
                  value={catFormData.slug || ''}
                  onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                  placeholder="auto-generated-if-empty"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                  Category Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={catFormData.image || ''}
                    onChange={(e) => setCatFormData({ ...catFormData, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadTarget('cat');
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-2 rounded-xl border border-elara-border-light dark:border-elara-border-dark flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catFormData.description || ''}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCat"
                  checked={Boolean(catFormData.featured)}
                  onChange={(e) => setCatFormData({ ...catFormData, featured: e.target.checked })}
                />
                <label htmlFor="featuredCat" className="font-semibold cursor-pointer">
                  Featured on storefront category bar
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COLLECTION MODAL */}
      {isCollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#252021] rounded-3xl p-6 border border-elara-border-light dark:border-elara-border-dark shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-elara-border-light mb-4">
              <h3 className="font-serif text-xl font-medium">
                {isEditingColl ? 'Edit Collection' : 'Create Collection'}
              </h3>
              <button onClick={() => setIsCollModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveColl} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={collFormData.title || ''}
                  onChange={(e) => setCollFormData({ ...collFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={collFormData.subtitle || ''}
                  onChange={(e) => setCollFormData({ ...collFormData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={collFormData.badge || ''}
                    onChange={(e) => setCollFormData({ ...collFormData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                    Visibility
                  </label>
                  <select
                    value={collFormData.isVisible !== false ? 'show' : 'hide'}
                    onChange={(e) => setCollFormData({ ...collFormData, isVisible: e.target.value === 'show' })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  >
                    <option value="show">Visible on Storefront</option>
                    <option value="hide">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-elara-text-muted mb-1">
                  Collection Banner Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={collFormData.image || ''}
                    onChange={(e) => setCollFormData({ ...collFormData, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadTarget('coll');
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-2 rounded-xl border border-elara-border-light dark:border-elara-border-dark flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCollModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase"
                >
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#252021] rounded-3xl p-6 text-center border border-elara-border-light shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium">Delete {itemToDelete.type}?</h3>
            <p className="text-xs text-elara-text-muted mt-2">
              Are you sure you want to delete <strong>"{itemToDelete.name}"</strong>? This will remove it from the live storefront.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 rounded-xl border text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold uppercase"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

