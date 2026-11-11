import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:ElaraDB%402026@localhost:5432/elara_db';

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

let isPgConnected = false;

export async function initPostgres() {
  try {
    const client = await pool.connect();
    isPgConnected = true;
    console.log('🐘 PostgreSQL connected successfully to database: elara_db');

    // 1. Create Admins Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        password_hash VARCHAR(255) NOT NULL,
        must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE
      );
    `);

    // 2. Create Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        tagline TEXT,
        price INTEGER NOT NULL,
        original_price INTEGER,
        discount_percentage INTEGER,
        rating NUMERIC(3,2) DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        category VARCHAR(100) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        collections JSONB DEFAULT '[]'::jsonb,
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        description TEXT,
        details JSONB DEFAULT '{}'::jsonb,
        features JSONB DEFAULT '[]'::jsonb,
        variations JSONB DEFAULT '[]'::jsonb,
        reviews JSONB DEFAULT '[]'::jsonb,
        is_bestseller BOOLEAN DEFAULT FALSE,
        is_trending BOOLEAN DEFAULT FALSE,
        is_new_arrival BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        in_stock BOOLEAN DEFAULT TRUE,
        stock_count INTEGER DEFAULT 15,
        sku VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Create Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        image TEXT,
        description TEXT,
        item_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0
      );
    `);

    // 4. Create Collections Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        image TEXT,
        badge VARCHAR(100),
        filter_key VARCHAR(100) DEFAULT 'collection',
        filter_value VARCHAR(100),
        product_ids JSONB DEFAULT '[]'::jsonb,
        is_visible BOOLEAN DEFAULT TRUE
      );
    `);

    // 5. Create Homepage Content Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_content (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
        content JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 6. Create Pages Content Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pages_content (
        slug VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        hero_image TEXT,
        sections JSONB DEFAULT '[]'::jsonb,
        extra_data JSONB DEFAULT '{}'::jsonb,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 7. Create Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(100) PRIMARY KEY,
        date VARCHAR(100) NOT NULL,
        items JSONB NOT NULL,
        customer JSONB NOT NULL,
        subtotal INTEGER NOT NULL,
        discount INTEGER DEFAULT 0,
        gift_wrap_fee INTEGER DEFAULT 0,
        shipping_fee INTEGER DEFAULT 0,
        total INTEGER NOT NULL,
        payment_method VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        tracking_number VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 8. Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        avatar TEXT,
        provider VARCHAR(50) DEFAULT 'email',
        joined_date VARCHAR(100),
        addresses JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Seed Data into PostgreSQL if empty
    await seedPostgresFromDataFiles(client);

    client.release();
    return true;
  } catch (err) {
    isPgConnected = false;
    console.error('PostgreSQL initialization notice (falling back to JSON persistence):', err.message);
    return false;
  }
}

async function seedPostgresFromDataFiles(client) {
  try {
    // 1. Seed Admins
    const adminCountRes = await client.query('SELECT COUNT(*) FROM admins');
    if (parseInt(adminCountRes.rows[0].count) === 0) {
      const adminsFile = path.join(DATA_DIR, 'admins.json');
      if (fs.existsSync(adminsFile)) {
        const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
        for (const adm of admins) {
          await client.query(
            `INSERT INTO admins (id, email, name, role, password_hash, must_change_password, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (email) DO NOTHING`,
            [adm.id, adm.email.toLowerCase(), adm.name, adm.role, adm.passwordHash, adm.mustChangePassword, adm.createdAt]
          );
        }
        console.log(`🐘 Seeded ${admins.length} authorized administrators into PostgreSQL.`);
      }
    }

    // 2. Seed Products
    const prodCountRes = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(prodCountRes.rows[0].count) === 0) {
      const prodsFile = path.join(DATA_DIR, 'products.json');
      if (fs.existsSync(prodsFile)) {
        const prods = JSON.parse(fs.readFileSync(prodsFile, 'utf-8'));
        for (const p of prods) {
          await client.query(
            `INSERT INTO products (id, name, slug, tagline, price, original_price, discount_percentage, rating, review_count, category, category_name, collections, images, description, details, features, variations, reviews, is_bestseller, is_trending, is_new_arrival, is_featured, is_published, in_stock, stock_count, sku)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
             ON CONFLICT (id) DO NOTHING`,
            [
              p.id,
              p.name,
              p.slug,
              p.tagline || '',
              p.price,
              p.originalPrice || p.price,
              p.discountPercentage || 0,
              p.rating || 5.0,
              p.reviewCount || 0,
              p.category,
              p.categoryName || p.category,
              JSON.stringify(p.collections || []),
              JSON.stringify(p.images || []),
              p.description || '',
              JSON.stringify(p.details || {}),
              JSON.stringify(p.features || []),
              JSON.stringify(p.variations || []),
              JSON.stringify(p.reviews || []),
              Boolean(p.isBestseller),
              Boolean(p.isTrending),
              Boolean(p.isNewArrival),
              Boolean(p.isFeatured),
              p.isPublished !== false,
              p.inStock !== false,
              p.stockCount || 15,
              p.sku || '',
            ]
          );
        }
        console.log(`🐘 Seeded ${prods.length} products into PostgreSQL.`);
      }
    }

    // 3. Seed Categories
    const catCountRes = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(catCountRes.rows[0].count) === 0) {
      const catsFile = path.join(DATA_DIR, 'categories.json');
      if (fs.existsSync(catsFile)) {
        const cats = JSON.parse(fs.readFileSync(catsFile, 'utf-8'));
        for (const c of cats) {
          await client.query(
            `INSERT INTO categories (id, slug, name, image, description, item_count, featured, display_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [c.id || c.slug, c.slug, c.name, c.image, c.description || '', c.itemCount || 0, Boolean(c.featured), c.displayOrder || 0]
          );
        }
        console.log(`🐘 Seeded ${cats.length} categories into PostgreSQL.`);
      }
    }

    // 4. Seed Collections
    const collCountRes = await client.query('SELECT COUNT(*) FROM collections');
    if (parseInt(collCountRes.rows[0].count) === 0) {
      const collsFile = path.join(DATA_DIR, 'collections.json');
      if (fs.existsSync(collsFile)) {
        const colls = JSON.parse(fs.readFileSync(collsFile, 'utf-8'));
        for (const col of colls) {
          await client.query(
            `INSERT INTO collections (id, slug, title, subtitle, image, badge, filter_key, filter_value, product_ids, is_visible)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO NOTHING`,
            [col.id || col.slug, col.slug, col.title, col.subtitle || '', col.image, col.badge || 'Curated', col.filterKey || 'collection', col.filterValue || col.slug, JSON.stringify(col.productIds || []), col.isVisible !== false]
          );
        }
        console.log(`🐘 Seeded ${colls.length} collections into PostgreSQL.`);
      }
    }

    // 5. Seed Homepage Content
    const homeCountRes = await client.query('SELECT COUNT(*) FROM homepage_content');
    if (parseInt(homeCountRes.rows[0].count) === 0) {
      const homeFile = path.join(DATA_DIR, 'homepage.json');
      if (fs.existsSync(homeFile)) {
        const home = JSON.parse(fs.readFileSync(homeFile, 'utf-8'));
        await client.query(
          `INSERT INTO homepage_content (id, content) VALUES ('current', $1)
           ON CONFLICT (id) DO UPDATE SET content = $1`,
          [JSON.stringify(home)]
        );
        console.log('🐘 Seeded homepage content into PostgreSQL.');
      }
    }

    // 6. Seed Pages Content
    const pageCountRes = await client.query('SELECT COUNT(*) FROM pages_content');
    if (parseInt(pageCountRes.rows[0].count) === 0) {
      const pagesFile = path.join(DATA_DIR, 'pages.json');
      if (fs.existsSync(pagesFile)) {
        const pages = JSON.parse(fs.readFileSync(pagesFile, 'utf-8'));
        for (const [slug, pgData] of Object.entries(pages)) {
          await client.query(
            `INSERT INTO pages_content (slug, title, subtitle, hero_image, sections, extra_data)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (slug) DO NOTHING`,
            [slug, pgData.title, pgData.subtitle || '', pgData.heroImage || '', JSON.stringify(pgData.sections || []), JSON.stringify(pgData.extraData || {})]
          );
        }
        console.log('🐘 Seeded website pages content into PostgreSQL.');
      }
    }
  } catch (err) {
    console.error('PostgreSQL seed error:', err);
  }
}

export function isPgReady() {
  return isPgConnected;
}

