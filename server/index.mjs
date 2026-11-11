import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCollection, writeCollection } from './db.mjs';
import { initPostgres, pool } from './postgres.mjs';
import {
  ensureAdminsProvisioned,
  authenticateAdmin,
  changeAdminPassword,
  verifyToken,
  invalidateToken,
  AUTHORIZED_ADMIN_EMAILS,
} from './auth.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PUBLIC_UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch (e) {}
try {
  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
} catch (e) {}

// Initialize PostgreSQL and ensure admin accounts exist
initPostgres().then(() => {
  ensureAdminsProvisioned();
});

// Helper to send JSON responses (compatible with raw Node & Vercel serverless)
function sendJson(res, statusCode, data) {
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// Helper to parse JSON body (compatible with raw Node & Vercel serverless)
function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (req.body && typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch (e) {
      return Promise.resolve({});
    }
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Authentication middleware for admin routes
function requireAdmin(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendJson(res, 401, { success: false, error: 'Authorization header with Bearer token required.' });
    return null;
  }
  const token = authHeader.substring(7);
  const admin = verifyToken(token);
  if (!admin) {
    sendJson(res, 401, { success: false, error: 'Invalid or expired administrator session.' });
    return null;
  }
  return { admin, token };
}

// Serve static uploaded files
function serveStaticFile(req, res, filePath) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('File not found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=86400',
  });
  fs.createReadStream(filePath).pipe(res);
}

// Helper to map DB row to product
function mapRowToProduct(r) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    tagline: r.tagline,
    price: r.price,
    originalPrice: r.original_price,
    discountPercentage: r.discount_percentage,
    rating: parseFloat(r.rating) || 5.0,
    reviewCount: r.review_count || 0,
    category: r.category,
    categoryName: r.category_name,
    collections: r.collections || [],
    images: r.images || [],
    description: r.description,
    details: r.details || {},
    features: r.features || [],
    variations: r.variations || [],
    reviews: r.reviews || [],
    isBestseller: Boolean(r.is_bestseller),
    isTrending: Boolean(r.is_trending),
    isNewArrival: Boolean(r.is_new_arrival),
    isFeatured: Boolean(r.is_featured),
    isPublished: r.is_published !== false,
    inStock: r.in_stock !== false,
    stockCount: r.stock_count || 15,
    sku: r.sku || '',
  };
}

export async function handleRequest(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const clientIp = req.socket?.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';

  // Serve uploaded images statically
  if (pathname.startsWith('/uploads/')) {
    const filename = path.basename(pathname);
    const filePath = path.join(UPLOADS_DIR, filename);
    return serveStaticFile(req, res, filePath);
  }

  try {
    // -------------------------------------------------------------
    // ADMIN AUTHENTICATION ENDPOINTS
    // -------------------------------------------------------------

    // Admin Login
    if (req.method === 'POST' && pathname === '/api/admin/login') {
      const { email, password } = await parseBody(req);
      if (!email || !password) {
        return sendJson(res, 400, { success: false, error: 'Email and password are required.' });
      }

      const result = await authenticateAdmin(email, password, `${clientIp}_${email}`);
      return sendJson(res, result.status, result);
    }

    // Admin Change Initial / Current Password
    if (req.method === 'POST' && pathname === '/api/admin/change-password') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const { currentPassword, newPassword } = await parseBody(req);
      if (!currentPassword || !newPassword) {
        return sendJson(res, 400, {
          success: false,
          error: 'Current password and new password are required.',
        });
      }

      const result = await changeAdminPassword(auth.admin.id, currentPassword, newPassword);
      return sendJson(res, result.status, result);
    }

    // Get Current Admin Info
    if (req.method === 'GET' && pathname === '/api/admin/me') {
      const auth = requireAdmin(req, res);
      if (!auth) return;
      return sendJson(res, 200, { success: true, admin: auth.admin });
    }

    // Admin Logout
    if (req.method === 'POST' && pathname === '/api/admin/logout') {
      const auth = requireAdmin(req, res);
      if (auth) invalidateToken(auth.token);
      return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
    }

    // -------------------------------------------------------------
    // ADMIN DASHBOARD METRICS
    // -------------------------------------------------------------
    if (req.method === 'GET' && pathname === '/api/admin/dashboard') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      let products = [];
      let categories = [];
      let collections = [];
      let orders = [];

      try {
        const [pRes, cRes, colRes, oRes] = await Promise.all([
          pool.query('SELECT * FROM products ORDER BY created_at DESC'),
          pool.query('SELECT * FROM categories'),
          pool.query('SELECT * FROM collections'),
          pool.query('SELECT * FROM orders ORDER BY created_at DESC'),
        ]);
        products = pRes.rows.map(mapRowToProduct);
        categories = cRes.rows;
        collections = colRes.rows;
        orders = oRes.rows.map((r) => ({
          orderId: r.order_id,
          date: r.date,
          items: r.items,
          customer: r.customer,
          subtotal: r.subtotal,
          discount: r.discount,
          giftWrapFee: r.gift_wrap_fee,
          shippingFee: r.shipping_fee,
          total: r.total,
          paymentMethod: r.payment_method,
          status: r.status,
          trackingNumber: r.tracking_number,
        }));
      } catch (e) {
        products = readCollection('products', []);
        categories = readCollection('categories', []);
        collections = readCollection('collections', []);
        orders = readCollection('orders', []);
      }

      const lowStockProducts = products.filter(
        (p) => (p.stockCount !== undefined && p.stockCount <= 5) || !p.inStock
      );
      const recentOrders = [...orders].slice(0, 8);

      return sendJson(res, 200, {
        success: true,
        metrics: {
          totalProducts: products.length,
          totalCategories: categories.length,
          totalCollections: collections.length,
          totalOrders: orders.length,
          recentOrders,
          lowStockProducts,
        },
      });
    }

    // -------------------------------------------------------------
    // IMAGE UPLOAD API
    // -------------------------------------------------------------
    if (req.method === 'POST' && pathname === '/api/admin/upload') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const body = await parseBody(req);
      const { filename, data, mimeType } = body;

      if (!data || !filename) {
        return sendJson(res, 400, { success: false, error: 'Missing image payload or filename.' });
      }

      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const ext = path.extname(filename).toLowerCase();
      const detectedMime =
        mimeType ||
        (ext === '.png'
          ? 'image/png'
          : ext === '.webp'
          ? 'image/webp'
          : ext === '.gif'
          ? 'image/gif'
          : 'image/jpeg');

      if (!allowedMimes.includes(detectedMime)) {
        return sendJson(res, 400, {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted.',
        });
      }

      const base64Data = data.includes('base64,') ? data.split('base64,')[1] : data;
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 5 * 1024 * 1024) {
        return sendJson(res, 400, { success: false, error: 'File size exceeds maximum 5MB limit.' });
      }

      const safeExt = ext.replace(/[^a-z0-9.]/gi, '') || '.jpg';
      const safeFilename = `elara_${Date.now()}_${Math.floor(Math.random() * 100000)}${safeExt}`;

      const serverDest = path.join(UPLOADS_DIR, safeFilename);
      const publicDest = path.join(PUBLIC_UPLOADS_DIR, safeFilename);

      fs.writeFileSync(serverDest, buffer);
      try {
        fs.writeFileSync(publicDest, buffer);
      } catch (e) {}

      const imageUrl = `/uploads/${safeFilename}`;
      return sendJson(res, 201, {
        success: true,
        url: imageUrl,
        filename: safeFilename,
      });
    }

    // -------------------------------------------------------------
    // PRODUCTS API
    // -------------------------------------------------------------

    // Get products (Public / Admin)
    if (req.method === 'GET' && pathname === '/api/products') {
      let products = [];
      try {
        const pgRes = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        products = pgRes.rows.map(mapRowToProduct);
      } catch (e) {
        products = readCollection('products', []);
      }

      const category = url.searchParams.get('category');
      const collection = url.searchParams.get('collection');
      const search = url.searchParams.get('search');
      const all = url.searchParams.get('all') === 'true';

      if (!all) {
        products = products.filter((p) => p.isPublished !== false);
      }

      if (category) {
        products = products.filter(
          (p) =>
            p.category === category ||
            p.categoryName?.toLowerCase() === category.toLowerCase()
        );
      }
      if (collection) {
        products = products.filter((p) => p.collections?.includes(collection));
      }
      if (search) {
        const query = search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.tagline?.toLowerCase().includes(query) ||
            p.categoryName?.toLowerCase().includes(query)
        );
      }

      return sendJson(res, 200, { success: true, count: products.length, products });
    }

    // Admin Products List
    if (req.method === 'GET' && pathname === '/api/admin/products') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      let products = [];
      try {
        const pgRes = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        products = pgRes.rows.map(mapRowToProduct);
      } catch (e) {
        products = readCollection('products', []);
      }

      return sendJson(res, 200, { success: true, count: products.length, products });
    }

    // Get Single Product by ID or Slug
    if (req.method === 'GET' && pathname.startsWith('/api/products/')) {
      const idOrSlug = pathname.replace('/api/products/', '');
      let product = null;

      try {
        const pgRes = await pool.query(
          'SELECT * FROM products WHERE id = $1 OR slug = $1 LIMIT 1',
          [idOrSlug]
        );
        if (pgRes.rows.length > 0) {
          product = mapRowToProduct(pgRes.rows[0]);
        }
      } catch (e) {
        const products = readCollection('products', []);
        product = products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
      }

      if (!product) {
        return sendJson(res, 404, { success: false, error: 'Product not found.' });
      }
      return sendJson(res, 200, { success: true, product });
    }

    // Admin: Create Product
    if (req.method === 'POST' && pathname === '/api/admin/products') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const newProductData = await parseBody(req);
      if (!newProductData.name || !newProductData.price) {
        return sendJson(res, 400, { success: false, error: 'Product name and price are required.' });
      }

      const id = newProductData.id || `elara-item-${Date.now()}`;
      const slug =
        newProductData.slug ||
        newProductData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const newProduct = {
        ...newProductData,
        id,
        slug,
        rating: newProductData.rating || 5.0,
        reviewCount: newProductData.reviewCount || 0,
        isPublished: newProductData.isPublished !== undefined ? newProductData.isPublished : true,
        inStock: newProductData.inStock !== undefined ? newProductData.inStock : true,
        stockCount: newProductData.stockCount !== undefined ? Number(newProductData.stockCount) : 15,
        images:
          newProductData.images && newProductData.images.length > 0
            ? newProductData.images
            : ['https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80'],
        details: newProductData.details || {
          dispatchTime: 'Dispatched within 24 hours',
          handmade: true,
        },
        features: newProductData.features || ['Artisanal crafted', 'Signature gift box packaging'],
        reviews: newProductData.reviews || [],
      };

      // Insert into PostgreSQL
      try {
        await pool.query(
          `INSERT INTO products (id, name, slug, tagline, price, original_price, discount_percentage, rating, review_count, category, category_name, collections, images, description, details, features, variations, reviews, is_bestseller, is_trending, is_new_arrival, is_featured, is_published, in_stock, stock_count, sku)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
           ON CONFLICT (id) DO UPDATE SET name = $2, price = $5, stock_count = $25, is_published = $23`,
          [
            newProduct.id,
            newProduct.name,
            newProduct.slug,
            newProduct.tagline || '',
            newProduct.price,
            newProduct.originalPrice || newProduct.price,
            newProduct.discountPercentage || 0,
            newProduct.rating,
            newProduct.reviewCount,
            newProduct.category,
            newProduct.categoryName,
            JSON.stringify(newProduct.collections || []),
            JSON.stringify(newProduct.images || []),
            newProduct.description || '',
            JSON.stringify(newProduct.details || {}),
            JSON.stringify(newProduct.features || []),
            JSON.stringify(newProduct.variations || []),
            JSON.stringify(newProduct.reviews || []),
            Boolean(newProduct.isBestseller),
            Boolean(newProduct.isTrending),
            Boolean(newProduct.isNewArrival),
            Boolean(newProduct.isFeatured),
            newProduct.isPublished,
            newProduct.inStock,
            newProduct.stockCount,
            newProduct.sku || '',
          ]
        );
      } catch (e) {
        console.error('PostgreSQL insert error:', e.message);
      }

      // Sync to JSON backup
      const products = readCollection('products', []);
      products.unshift(newProduct);
      writeCollection('products', products);

      return sendJson(res, 201, { success: true, product: newProduct });
    }

    // Admin: Update Product
    if (req.method === 'PUT' && pathname.startsWith('/api/admin/products/')) {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const productId = pathname.replace('/api/admin/products/', '');
      const updates = await parseBody(req);
      const products = readCollection('products', []);
      const index = products.findIndex((p) => p.id === productId);

      let updatedProduct = null;
      if (index > -1) {
        updatedProduct = { ...products[index], ...updates, id: productId };
        if (
          updatedProduct.price &&
          updatedProduct.originalPrice &&
          updatedProduct.originalPrice > updatedProduct.price
        ) {
          updatedProduct.discountPercentage = Math.round(
            ((updatedProduct.originalPrice - updatedProduct.price) / updatedProduct.originalPrice) * 100
          );
        }
        products[index] = updatedProduct;
        writeCollection('products', products);
      }

      // Update in PostgreSQL
      try {
        await pool.query(
          `UPDATE products SET
            name = COALESCE($2, name),
            price = COALESCE($3, price),
            original_price = COALESCE($4, original_price),
            stock_count = COALESCE($5, stock_count),
            is_published = COALESCE($6, is_published),
            is_featured = COALESCE($7, is_featured),
            description = COALESCE($8, description),
            images = COALESCE($9, images),
            updated_at = NOW()
           WHERE id = $1`,
          [
            productId,
            updates.name,
            updates.price,
            updates.originalPrice,
            updates.stockCount,
            updates.isPublished,
            updates.isFeatured,
            updates.description,
            updates.images ? JSON.stringify(updates.images) : null,
          ]
        );

        if (!updatedProduct) {
          const pgRes = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
          if (pgRes.rows.length > 0) updatedProduct = mapRowToProduct(pgRes.rows[0]);
        }
      } catch (e) {
        console.error('PostgreSQL update error:', e.message);
      }

      if (!updatedProduct) {
        return sendJson(res, 404, { success: false, error: 'Product not found.' });
      }

      return sendJson(res, 200, { success: true, product: updatedProduct });
    }

    // Admin: Delete Product
    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/products/')) {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const productId = pathname.replace('/api/admin/products/', '');

      // Delete from PostgreSQL
      try {
        await pool.query('DELETE FROM products WHERE id = $1', [productId]);
      } catch (e) {}

      // Delete from JSON
      const products = readCollection('products', []);
      const index = products.findIndex((p) => p.id === productId);
      if (index > -1) {
        products.splice(index, 1);
        writeCollection('products', products);
      }

      return sendJson(res, 200, { success: true, message: 'Product deleted.', id: productId });
    }

    // -------------------------------------------------------------
    // CATEGORIES API
    // -------------------------------------------------------------
    if (req.method === 'GET' && pathname === '/api/categories') {
      let categories = [];
      try {
        const res = await pool.query('SELECT * FROM categories ORDER BY display_order ASC');
        categories = res.rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          image: r.image,
          description: r.description,
          itemCount: r.item_count,
          featured: Boolean(r.featured),
          displayOrder: r.display_order,
        }));
      } catch (e) {
        categories = readCollection('categories', []);
      }
      return sendJson(res, 200, { success: true, categories });
    }

    if (req.method === 'POST' && pathname === '/api/admin/categories') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const catData = await parseBody(req);
      if (!catData.name) {
        return sendJson(res, 400, { success: false, error: 'Category name is required.' });
      }

      const slug =
        catData.slug ||
        catData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const newCategory = {
        id: slug,
        slug,
        name: catData.name,
        image:
          catData.image ||
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
        description: catData.description || '',
        itemCount: 0,
        featured: Boolean(catData.featured),
        displayOrder: 10,
      };

      try {
        await pool.query(
          `INSERT INTO categories (id, slug, name, image, description, item_count, featured, display_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET name = $3, image = $4`,
          [
            newCategory.id,
            newCategory.slug,
            newCategory.name,
            newCategory.image,
            newCategory.description,
            newCategory.itemCount,
            newCategory.featured,
            newCategory.displayOrder,
          ]
        );
      } catch (e) {}

      const categories = readCollection('categories', []);
      categories.push(newCategory);
      writeCollection('categories', categories);

      return sendJson(res, 201, { success: true, category: newCategory });
    }

    if (req.method === 'PUT' && pathname.startsWith('/api/admin/categories/')) {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const catId = pathname.replace('/api/admin/categories/', '');
      const updates = await parseBody(req);

      try {
        await pool.query(
          `UPDATE categories SET
            name = COALESCE($2, name),
            image = COALESCE($3, image),
            description = COALESCE($4, description),
            featured = COALESCE($5, featured)
           WHERE id = $1 OR slug = $1`,
          [catId, updates.name, updates.image, updates.description, updates.featured]
        );
      } catch (e) {}

      const categories = readCollection('categories', []);
      const index = categories.findIndex((c) => c.id === catId || c.slug === catId);
      if (index > -1) {
        categories[index] = { ...categories[index], ...updates };
        writeCollection('categories', categories);
      }

      return sendJson(res, 200, { success: true, message: 'Category updated' });
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/categories/')) {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const catId = pathname.replace('/api/admin/categories/', '');
      try {
        await pool.query('DELETE FROM categories WHERE id = $1 OR slug = $1', [catId]);
      } catch (e) {}

      const categories = readCollection('categories', []);
      const index = categories.findIndex((c) => c.id === catId || c.slug === catId);
      if (index > -1) {
        categories.splice(index, 1);
        writeCollection('categories', categories);
      }

      return sendJson(res, 200, { success: true, message: 'Category deleted successfully.' });
    }

    // -------------------------------------------------------------
    // COLLECTIONS API
    // -------------------------------------------------------------
    if (req.method === 'GET' && pathname === '/api/collections') {
      let collections = [];
      try {
        const res = await pool.query('SELECT * FROM collections');
        collections = res.rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          subtitle: r.subtitle,
          image: r.image,
          badge: r.badge,
          filterKey: r.filter_key,
          filterValue: r.filter_value,
          productIds: r.product_ids || [],
          isVisible: r.is_visible !== false,
        }));
      } catch (e) {
        collections = readCollection('collections', []);
      }
      return sendJson(res, 200, { success: true, collections });
    }

    if (req.method === 'POST' && pathname === '/api/admin/collections') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const data = await parseBody(req);
      if (!data.title) {
        return sendJson(res, 400, { success: false, error: 'Collection title is required.' });
      }

      const slug =
        data.slug ||
        data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const newColl = {
        id: slug,
        slug,
        title: data.title,
        subtitle: data.subtitle || '',
        image:
          data.image ||
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
        badge: data.badge || 'Curated',
        filterKey: 'collection',
        filterValue: slug,
        productIds: data.productIds || [],
        isVisible: data.isVisible !== undefined ? data.isVisible : true,
      };

      try {
        await pool.query(
          `INSERT INTO collections (id, slug, title, subtitle, image, badge, filter_key, filter_value, product_ids, is_visible)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          [
            newColl.id,
            newColl.slug,
            newColl.title,
            newColl.subtitle,
            newColl.image,
            newColl.badge,
            newColl.filterKey,
            newColl.filterValue,
            JSON.stringify(newColl.productIds),
            newColl.isVisible,
          ]
        );
      } catch (e) {}

      const collections = readCollection('collections', []);
      collections.push(newColl);
      writeCollection('collections', collections);

      return sendJson(res, 201, { success: true, collection: newColl });
    }

    if (req.method === 'PUT' && pathname.startsWith('/api/admin/collections/')) {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const collId = pathname.replace('/api/admin/collections/', '');
      const updates = await parseBody(req);

      try {
        await pool.query(
          `UPDATE collections SET
            title = COALESCE($2, title),
            subtitle = COALESCE($3, subtitle),
            image = COALESCE($4, image),
            is_visible = COALESCE($5, is_visible)
           WHERE id = $1 OR slug = $1`,
          [collId, updates.title, updates.subtitle, updates.image, updates.isVisible]
        );
      } catch (e) {}

      const collections = readCollection('collections', []);
      const index = collections.findIndex((c) => c.id === collId || c.slug === collId);
      if (index > -1) {
        collections[index] = { ...collections[index], ...updates };
        writeCollection('collections', collections);
      }

      return sendJson(res, 200, { success: true, message: 'Collection updated' });
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/collections/')) {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const collId = pathname.replace('/api/admin/collections/', '');
      try {
        await pool.query('DELETE FROM collections WHERE id = $1 OR slug = $1', [collId]);
      } catch (e) {}

      const collections = readCollection('collections', []);
      const index = collections.findIndex((c) => c.id === collId || c.slug === collId);
      if (index > -1) {
        collections.splice(index, 1);
        writeCollection('collections', collections);
      }

      return sendJson(res, 200, { success: true, message: 'Collection deleted successfully.' });
    }

    // -------------------------------------------------------------
    // HOMEPAGE CONTENT API
    // -------------------------------------------------------------
    if (req.method === 'GET' && pathname === '/api/content/homepage') {
      let homepage = null;
      try {
        const res = await pool.query("SELECT content FROM homepage_content WHERE id = 'current'");
        if (res.rows.length > 0) homepage = res.rows[0].content;
      } catch (e) {}

      if (!homepage) homepage = readCollection('homepage', {});
      return sendJson(res, 200, { success: true, homepage });
    }

    if (req.method === 'PUT' && pathname === '/api/admin/content/homepage') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const updates = await parseBody(req);
      const current = readCollection('homepage', {});
      const merged = { ...current, ...updates };

      try {
        await pool.query(
          `INSERT INTO homepage_content (id, content, updated_at)
           VALUES ('current', $1, NOW())
           ON CONFLICT (id) DO UPDATE SET content = $1, updated_at = NOW()`,
          [JSON.stringify(merged)]
        );
      } catch (e) {}

      writeCollection('homepage', merged);
      return sendJson(res, 200, { success: true, homepage: merged });
    }

    // -------------------------------------------------------------
    // WEBSITE PAGES CONTENT API
    // -------------------------------------------------------------
    if (req.method === 'GET' && pathname.startsWith('/api/content/pages/')) {
      const slug = pathname.replace('/api/content/pages/', '');
      let page = null;

      try {
        const res = await pool.query('SELECT * FROM pages_content WHERE slug = $1', [slug]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          page = {
            slug: r.slug,
            title: r.title,
            subtitle: r.subtitle,
            heroImage: r.hero_image,
            sections: r.sections || [],
            extraData: r.extra_data || {},
          };
        }
      } catch (e) {}

      if (!page) {
        const pages = readCollection('pages', {});
        page = pages[slug];
      }

      if (!page) {
        return sendJson(res, 404, { success: false, error: 'Page content not found.' });
      }
      return sendJson(res, 200, { success: true, page });
    }

    if (req.method === 'GET' && pathname === '/api/admin/pages') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const pages = readCollection('pages', {});
      return sendJson(res, 200, { success: true, pages });
    }

    if (req.method === 'PUT' && pathname.startsWith('/api/admin/content/pages/')) {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const slug = pathname.replace('/api/admin/content/pages/', '');
      const updates = await parseBody(req);

      try {
        await pool.query(
          `UPDATE pages_content SET
            title = COALESCE($2, title),
            subtitle = COALESCE($3, subtitle),
            hero_image = COALESCE($4, hero_image),
            sections = COALESCE($5, sections),
            extra_data = COALESCE($6, extra_data),
            last_updated = NOW()
           WHERE slug = $1`,
          [
            slug,
            updates.title,
            updates.subtitle,
            updates.heroImage,
            updates.sections ? JSON.stringify(updates.sections) : null,
            updates.extraData ? JSON.stringify(updates.extraData) : null,
          ]
        );
      } catch (e) {}

      const pages = readCollection('pages', {});
      pages[slug] = {
        ...pages[slug],
        ...updates,
        slug,
        lastUpdated: new Date().toISOString(),
      };
      writeCollection('pages', pages);

      return sendJson(res, 200, { success: true, page: pages[slug] });
    }

    // -------------------------------------------------------------
    // ORDERS API (Customer & Admin)
    // -------------------------------------------------------------
    if (req.method === 'GET' && pathname === '/api/admin/orders') {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      let orders = [];
      try {
        const res = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        orders = res.rows.map((r) => ({
          orderId: r.order_id,
          date: r.date,
          items: r.items,
          customer: r.customer,
          subtotal: r.subtotal,
          discount: r.discount,
          giftWrapFee: r.gift_wrap_fee,
          shippingFee: r.shipping_fee,
          total: r.total,
          paymentMethod: r.payment_method,
          status: r.status,
          trackingNumber: r.tracking_number,
        }));
      } catch (e) {
        orders = readCollection('orders', []);
      }

      const search = url.searchParams.get('search');
      const status = url.searchParams.get('status');

      if (status && status !== 'All') {
        orders = orders.filter((o) => (o.status || 'Pending').toLowerCase() === status.toLowerCase());
      }

      if (search) {
        const query = search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.orderId.toLowerCase().includes(query) ||
            o.trackingNumber?.toLowerCase().includes(query) ||
            o.customer?.fullName?.toLowerCase().includes(query) ||
            o.customer?.email?.toLowerCase().includes(query) ||
            o.customer?.phone?.includes(query)
        );
      }

      return sendJson(res, 200, { success: true, count: orders.length, orders });
    }

    // Admin: Update Order Status
    if (req.method === 'PUT' && pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status')) {
      const auth = requireAdmin(req, res);
      if (!auth) return;

      const orderId = pathname.replace('/api/admin/orders/', '').replace('/status', '');
      const { status } = await parseBody(req);

      const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return sendJson(res, 400, {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }

      try {
        await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2', [
          status,
          orderId,
        ]);
      } catch (e) {}

      const orders = readCollection('orders', []);
      const index = orders.findIndex((o) => o.orderId === orderId);
      if (index > -1) {
        orders[index].status = status;
        writeCollection('orders', orders);
      }

      return sendJson(res, 200, {
        success: true,
        orderId,
        status,
        order: index > -1 ? orders[index] : { orderId, status },
      });
    }

    // Customer Checkout: Place new order
    if (req.method === 'POST' && pathname === '/api/orders') {
      const orderData = await parseBody(req);
      const newOrder = {
        ...orderData,
        orderId: orderData.orderId || `ELR-${Date.now().toString().slice(-6)}`,
        status: 'Pending',
        trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
        createdAt: new Date().toISOString(),
      };

      try {
        await pool.query(
          `INSERT INTO orders (order_id, date, items, customer, subtotal, discount, gift_wrap_fee, shipping_fee, total, payment_method, status, tracking_number, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
           ON CONFLICT (order_id) DO NOTHING`,
          [
            newOrder.orderId,
            newOrder.date || new Date().toLocaleDateString('en-IN'),
            JSON.stringify(newOrder.items || []),
            JSON.stringify(newOrder.customer || {}),
            newOrder.subtotal || 0,
            newOrder.discount || 0,
            newOrder.giftWrapFee || 0,
            newOrder.shippingFee || 0,
            newOrder.total || 0,
            newOrder.paymentMethod || 'UPI',
            newOrder.status,
            newOrder.trackingNumber,
          ]
        );
      } catch (e) {
        console.error('PostgreSQL order insert error:', e.message);
      }

      const orders = readCollection('orders', []);
      orders.unshift(newOrder);
      writeCollection('orders', orders);

      return sendJson(res, 201, { success: true, order: newOrder });
    }

    // -------------------------------------------------------------
    // CUSTOMER AUTH & CART/WISHLIST ENDPOINTS
    // -------------------------------------------------------------
    // Unified Customer & Administrator Direct Login
    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const { email, password } = await parseBody(req);
      if (!email || !password) {
        return sendJson(res, 400, { success: false, error: 'Email and password are required' });
      }
      const cleanEmail = email.toLowerCase().trim();

      if (AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)) {
        const result = await authenticateAdmin(cleanEmail, password, `${clientIp}_${cleanEmail}`);
        if (result.status === 200) {
          const users = readCollection('users', []);
          let user = users.find((u) => u.email === cleanEmail);
          if (!user) {
            user = {
              id: result.admin.id,
              name: result.admin.name,
              email: cleanEmail,
              role: 'admin',
              provider: 'admin',
              joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              addresses: [],
            };
            users.push(user);
            writeCollection('users', users);
          } else {
            user.role = 'admin';
            writeCollection('users', users);
          }
          return sendJson(res, 200, {
            success: true,
            role: 'admin',
            admin: result.admin,
            token: result.token,
            mustChangePassword: result.mustChangePassword,
            user,
          });
        }
        return sendJson(res, result.status, result);
      }

      return sendJson(res, 200, {
        success: false,
        requiresOtp: true,
        message: 'Patron email verification requires OTP code.',
      });
    }

    if (req.method === 'POST' && pathname === '/api/auth/send-otp') {
      const { email } = await parseBody(req);
      if (!email) return sendJson(res, 400, { success: false, error: 'Email required' });
      const cleanEmail = email.toLowerCase().trim();
      return sendJson(res, 200, { success: true, message: `OTP sent to ${cleanEmail}`, otpCode: '123456' });
    }

    if (req.method === 'POST' && pathname === '/api/auth/verify-otp') {
      const { email, otp, fullName } = await parseBody(req);
      if (!email || !otp) return sendJson(res, 400, { success: false, error: 'Email and OTP required' });
      if (otp !== '123456') return sendJson(res, 400, { success: false, error: 'Invalid or expired OTP' });

      const cleanEmail = email.toLowerCase().trim();
      const users = readCollection('users', []);
      let user = users.find((u) => u.email === cleanEmail);
      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: fullName || cleanEmail.split('@')[0],
          email: cleanEmail,
          provider: 'email',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          addresses: [],
        };
        users.push(user);
        writeCollection('users', users);
      }
      return sendJson(res, 200, { success: true, user, token: `tok_${user.id}_${Date.now()}` });
    }

    if (req.method === 'POST' && pathname === '/api/auth/google') {
      const { email, name } = await parseBody(req);
      const cleanEmail = (email || 'patron.elara@gmail.com').toLowerCase().trim();
      const userName = name || 'Aarav Sharma';
      const users = readCollection('users', []);
      let user = users.find((u) => u.email === cleanEmail);

      if (!user) {
        user = {
          id: `usr_g_${Date.now()}`,
          name: userName,
          email: cleanEmail,
          provider: 'google',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          addresses: [
            {
              id: 'addr_1',
              fullName: userName,
              phone: '+91 98765 43210',
              addressLine1: '402, Rosewood Villa, 4th Cross',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560038',
              isDefault: true,
            },
          ],
        };
        users.push(user);
        writeCollection('users', users);
      }
      return sendJson(res, 200, { success: true, user, token: `tok_g_${user.id}_${Date.now()}` });
    }

    // Health Check
    if (pathname === '/api/health') {
      return sendJson(res, 200, {
        status: 'healthy',
        database: 'postgresql (elara_db)',
        timestamp: new Date().toISOString(),
      });
    }

    return sendJson(res, 404, { error: `Route ${req.method} ${pathname} not found` });
  } catch (err) {
    console.error('Server error:', err);
    return sendJson(res, 500, { success: false, error: 'Internal server error' });
  }
}

const server = http.createServer(handleRequest);

export { server };

// Direct execution listener
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => {
    console.log(`ELARA & CO. Production Backend & Admin API active on port ${PORT}`);
    console.log(`Connected to PostgreSQL: ${process.env.DB_NAME || 'elara_db'}`);
  });
}
