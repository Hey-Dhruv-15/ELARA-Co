import React, { useState, useEffect, useRef } from 'react';
import { AdminService } from '../../services/adminService';
import { Product, Category } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Link as LinkIcon,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'low-stock'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    price: 499,
    originalPrice: 699,
    discountPercentage: 28,
    category: '',
    categoryName: '',
    collections: [],
    images: [],
    description: '',
    details: {
      material: '',
      dimensions: '',
      care: '',
      packaging: 'Signature blush gift box with silk ribbon',
      handmade: true,
      dispatchTime: 'Dispatched within 24 hours',
    },
    features: ['Artisanal handcrafted', 'Hypoallergenic materials'],
    variations: [],
    isFeatured: false,
    isBestseller: false,
    isTrending: false,
    isNewArrival: true,
    isPublished: true,
    inStock: true,
    stockCount: 15,
    sku: '',
  });

  // Image Uploading / URL state
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial products and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        AdminService.getProducts(),
        AdminService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products', err);
      showToast('Failed to load products from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = p.isPublished !== false;
    else if (statusFilter === 'draft') matchesStatus = p.isPublished === false;
    else if (statusFilter === 'low-stock') matchesStatus = (p.stockCount !== undefined && p.stockCount <= 5) || !p.inStock;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingProductId(null);
    const defaultCat = categories[0];
    setFormData({
      name: '',
      tagline: '',
      price: 499,
      originalPrice: 699,
      discountPercentage: 28,
      category: defaultCat?.slug || defaultCat?.id || 'handmade-crafts',
      categoryName: defaultCat?.name || 'Handmade Crafts',
      collections: ['under-499', 'handmade'],
      images: [
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Handcrafted with grace in our studio.',
      details: {
        material: 'Premium materials',
        dimensions: 'Standard size',
        care: 'Store in dry place away from direct sunlight',
        packaging: 'Presented in signature embossed gift box',
        handmade: true,
        dispatchTime: 'Dispatched within 24 hours',
      },
      features: ['Handcrafted with intention', 'Complimentary gift box packaging'],
      variations: [],
      isFeatured: false,
      isBestseller: false,
      isTrending: false,
      isNewArrival: true,
      isPublished: true,
      inStock: true,
      stockCount: 15,
      sku: `ELR-ART-${Math.floor(100 + Math.random() * 900)}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true);
    setEditingProductId(product.id);
    setFormData({
      ...product,
      details: { ...product.details },
      features: product.features ? [...product.features] : [],
      variations: product.variations ? [...product.variations] : [],
      images: product.images ? [...product.images] : [],
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && editingProductId) {
        const updated = await AdminService.updateProduct(editingProductId, formData);
        setProducts((prev) => prev.map((p) => (p.id === editingProductId ? updated : p)));
        showToast(`Product "${updated.name}" updated successfully!`, 'success');
      } else {
        const created = await AdminService.createProduct(formData);
        setProducts((prev) => [created, ...prev]);
        showToast(`Product "${created.name}" created successfully!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await AdminService.deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast(`Product "${productToDelete.name}" deleted`, 'info');
      setProductToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Image Upload Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await AdminService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
      showToast('Image uploaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image', 'error');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (!formData.images) return;
    const images = [...formData.images];
    const [selected] = images.splice(index, 1);
    images.unshift(selected);
    setFormData((prev) => ({ ...prev, images }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-accent-light dark:text-elara-accent-dark">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-0.5">
            Boutique Products ({products.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#723c43] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 2. Filters & Search Controls */}
      <div className="bg-white dark:bg-[#252021] p-4 rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
          />
          <Search className="w-4 h-4 text-elara-text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs text-elara-text-dark dark:text-elara-text-light focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs text-elara-text-dark dark:text-elara-text-light focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts / Unpublished</option>
            <option value="low-stock">Low Stock (&le; 5)</option>
          </select>
        </div>
      </div>

      {/* 3. Products Table */}
      <div className="bg-white dark:bg-[#252021] rounded-3xl border border-elara-border-light dark:border-elara-border-dark shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-[#8A4A52] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-elara-text-muted mt-3 block">Loading catalog...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FFF9F7] dark:bg-[#191516] border-b border-elara-border-light dark:border-elara-border-dark text-[10px] font-bold uppercase tracking-wider text-elara-text-muted">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4">Flags</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-elara-border-light/40 dark:divide-elara-border-dark/40">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#FFF9F7]/70 dark:hover:bg-[#191516]/70 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=400&q=80'}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-elara-border-light dark:border-elara-border-dark"
                        />
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-semibold text-elara-text-dark dark:text-elara-text-light truncate">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-elara-text-muted truncate block">
                            {product.tagline || 'Artisanal gift'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-elara-text-muted">
                      {product.sku || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F7E9E7] dark:bg-[#302729] text-[#8A4A52] dark:text-elara-accent-dark font-medium">
                        {product.categoryName || product.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-serif font-bold text-elara-text-dark dark:text-elara-text-light block">
                        {formatINR(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-[10px] text-elara-text-muted line-through block">
                          {formatINR(product.originalPrice)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold ${
                          product.stockCount <= 5
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {product.stockCount} in stock
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {product.isFeatured && (
                          <span className="p-1 rounded bg-amber-100 text-amber-700" title="Featured on Homepage">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[9px] font-bold">
                            BEST
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {product.isPublished !== false ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Eye className="w-3.5 h-3.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <EyeOff className="w-3.5 h-3.5" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 rounded-lg border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light hover:bg-[#F7E9E7] dark:hover:bg-[#302729] transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-elara-text-muted">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <span>No products match the selected filters.</span>
          </div>
        )}
      </div>

      {/* 4. Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-elara-border-light dark:border-elara-border-dark mb-6">
              <div>
                <h3 className="font-serif text-xl font-medium text-elara-text-dark dark:text-elara-text-light">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h3>
                <span className="text-xs text-elara-text-muted">
                  Update inventory, pricing, imagery, and boutique details
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* Product Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs"
                    placeholder="e.g. Seraphina Freshwater Pearl Bracelet"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs font-mono"
                    placeholder="ELR-BRC-001"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs"
                  placeholder="e.g. Delicate freshwater pearls intertwined with blushing rose quartz"
                />
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => {
                      const cat = categories.find((c) => c.slug === e.target.value || c.id === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryName: cat ? cat.name : e.target.value,
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug || c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.stockCount || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockCount: Number(e.target.value),
                        inStock: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs font-mono"
                  />
                </div>
              </div>

              {/* Multiple Image Management */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark">
                <div className="flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-wider text-elara-text-muted">
                    Product Photographs ({formData.images?.length || 0})
                  </span>
                  <span className="text-[11px] text-elara-accent-light">
                    Drag/Select to change primary cover image
                  </span>
                </div>

                {/* Current Images List */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images?.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-elara-border-light dark:border-elara-border-dark aspect-square bg-white"
                    >
                      <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="px-2 py-1 rounded bg-[#8A4A52] text-white text-[10px] font-semibold"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#8A4A52] text-white text-[9px] font-bold">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Upload & URL Inputs */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-[#252021] border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold hover:border-elara-accent-light transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                  </button>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Or paste direct image URL (Unsplash, etc.)"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#252021] border border-elara-border-light dark:border-elara-border-dark text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 rounded-xl bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs leading-relaxed"
                  placeholder="Describe craftsmanship, artisan techniques, emotional gifting appeal..."
                />
              </div>

              {/* Atelier Details (Material, Dimensions, Care) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Material / Ingredients
                  </label>
                  <input
                    type="text"
                    value={formData.details?.material || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        details: { ...formData.details, material: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs"
                    placeholder="e.g. Freshwater Pearls, 14k Gold Plated"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Dimensions / Size
                  </label>
                  <input
                    type="text"
                    value={formData.details?.dimensions || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        details: { ...formData.details, dimensions: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs"
                    placeholder="e.g. 16cm + 4cm extension"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                    Dispatch Time
                  </label>
                  <input
                    type="text"
                    value={formData.details?.dispatchTime || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        details: { ...formData.details, dispatchTime: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs"
                    placeholder="e.g. Dispatched within 24 hours"
                  />
                </div>
              </div>

              {/* Toggles (Published, Featured, Bestseller, Trending) */}
              <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished !== false}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-[#8A4A52] focus:ring-[#8A4A52]"
                  />
                  <span className="font-semibold text-elara-text-dark dark:text-elara-text-light">
                    Published Live
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isFeatured)}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#8A4A52] focus:ring-[#8A4A52]"
                  />
                  <span className="font-semibold text-elara-text-dark dark:text-elara-text-light">
                    Featured
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isBestseller)}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="rounded text-[#8A4A52] focus:ring-[#8A4A52]"
                  />
                  <span className="font-semibold text-elara-text-dark dark:text-elara-text-light">
                    Bestseller
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isTrending)}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="rounded text-[#8A4A52] focus:ring-[#8A4A52]"
                  />
                  <span className="font-semibold text-elara-text-dark dark:text-elara-text-light">
                    Trending
                  </span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-elara-border-light dark:border-elara-border-dark">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center gap-2 shadow-sm"
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-elara-champagne" />
                  )}
                  <span>{isEditing ? 'Save Product Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-elara-text-dark dark:text-elara-text-light">
              Delete Product?
            </h3>
            <p className="text-xs text-elara-text-muted mt-2 leading-relaxed">
              Are you sure you want to delete <strong className="text-elara-text-dark dark:text-elara-text-light">"{productToDelete.name}"</strong>? This will permanently remove the item from the live storefront and backend database.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirmed}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

