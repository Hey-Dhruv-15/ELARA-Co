import http from 'node:http';
import { Readable, Writable } from 'node:stream';
import assert from 'node:assert';
import { server } from '../server/index.mjs';
import { resetAdminCredentials } from '../server/auth.mjs';

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const bodyStr = postData
      ? typeof postData === 'string'
        ? postData
        : JSON.stringify(postData)
      : '';

    let pushed = false;
    const req = new Readable({
      read() {
        if (!pushed) {
          pushed = true;
          if (bodyStr) this.push(Buffer.from(bodyStr));
          this.push(null);
        }
      },
    });

    req.method = options.method || 'GET';
    req.url = options.path;
    req.socket = { remoteAddress: '127.0.0.1' };
    const lowerHeaders = { host: 'localhost' };
    if (options.headers) {
      for (const [k, v] of Object.entries(options.headers)) {
        lowerHeaders[k.toLowerCase()] = v;
      }
    }
    req.headers = lowerHeaders;
    if (bodyStr && !req.headers['content-length']) {
      req.headers['content-length'] = Buffer.byteLength(bodyStr).toString();
    }

    let rawData = '';
    const headersObj = {};
    const res = new Writable({
      write(chunk, encoding, callback) {
        rawData += chunk.toString();
        callback();
      },
    });

    res.statusCode = 200;
    res.headers = headersObj;
    res.writeHead = (statusCode, headers = {}) => {
      res.statusCode = statusCode;
      Object.assign(headersObj, headers);
      return res;
    };
    res.setHeader = (key, value) => {
      headersObj[key.toLowerCase()] = value;
      return res;
    };
    res.getHeader = (key) => headersObj[key.toLowerCase()];
    res.hasHeader = (key) => key.toLowerCase() in headersObj;
    res.removeHeader = (key) => {
      delete headersObj[key.toLowerCase()];
      return res;
    };

    res.on('finish', () => {
      let data = {};
      try {
        data = rawData ? JSON.parse(rawData) : {};
      } catch (err) {
        data = rawData;
      }
      resolve({
        status: res.statusCode,
        data,
        raw: rawData,
        headers: headersObj,
      });
    });

    res.on('error', reject);
    req.on('error', reject);

    server.emit('request', req, res);
  });
}

async function runTests() {
  console.log('--- 🧪 STARTING ELARA & CO. ADMIN & STOREFRONT BACKEND TEST SUITE ---');

  // Allow PostgreSQL/data-file initialization and admin provisioning to complete
  await new Promise((r) => setTimeout(r, 600));
  await resetAdminCredentials('supreethr101105@gmail.com');
  console.log('Backend server & database initialisation ready');

  try {
    // 1. Health check
    console.log('Test 1: Health check endpoint...');
    const health = await request({ path: '/api/health', method: 'GET' });
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.status, 'healthy');
    console.log('✅ Health check passed.');

    // 2. Reject unauthenticated access to admin dashboard
    console.log('Test 2: Security check - reject unauthenticated admin request...');
    const unauth = await request({ path: '/api/admin/dashboard', method: 'GET' });
    assert.strictEqual(unauth.status, 401);
    console.log('✅ Unauthenticated access correctly blocked with 401.');

    // 3. Reject unauthorized email
    console.log('Test 3: Reject non-authorized email login...');
    const nonAdmin = await request(
      { path: '/api/admin/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'random.hacker@gmail.com', password: 'Elara@2026' }
    );
    assert.strictEqual(nonAdmin.status, 401);
    console.log('✅ Unauthorized email rejected with 401.');

    // 4. Authorized Admin Login with Initial Password
    console.log('Test 4: Authorized Admin login with initial password (supreethr101105@gmail.com)...');
    const loginRes = await request(
      { path: '/api/admin/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'supreethr101105@gmail.com', password: 'Elara@2026' }
    );
    assert.strictEqual(loginRes.status, 200);
    assert.ok(loginRes.data.token, 'Token must be returned');
    assert.strictEqual(loginRes.data.admin.email, 'supreethr101105@gmail.com');
    assert.strictEqual(loginRes.data.admin.mustChangePassword, true);
    const adminToken = loginRes.data.token;
    console.log('✅ Authorized admin login succeeded with mustChangePassword: true.');

    // 5. Change Password Validation & Execution
    console.log('Test 5: Password change flow...');
    // A: Reject reusing initial password
    const reusePass = await request(
      {
        path: '/api/admin/change-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      },
      { currentPassword: 'Elara@2026', newPassword: 'Elara@2026' }
    );
    assert.strictEqual(reusePass.status, 400);

    // B: Reject weak password
    const weakPass = await request(
      {
        path: '/api/admin/change-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      },
      { currentPassword: 'Elara@2026', newPassword: 'simple' }
    );
    assert.strictEqual(weakPass.status, 400);

    // C: Valid strong password
    const validChange = await request(
      {
        path: '/api/admin/change-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      },
      { currentPassword: 'Elara@2026', newPassword: 'RosewaterStudio#2026' }
    );
    assert.strictEqual(validChange.status, 200);
    assert.strictEqual(validChange.data.admin.mustChangePassword, false);
    const updatedToken = validChange.data.token;
    console.log('✅ Password successfully changed to secure custom password.');

    // 6. Admin Dashboard Metrics
    console.log('Test 6: Retrieve Admin Dashboard metrics...');
    const dash = await request({
      path: '/api/admin/dashboard',
      method: 'GET',
      headers: { Authorization: `Bearer ${updatedToken}` },
    });
    assert.strictEqual(dash.status, 200);
    assert.ok(dash.data.metrics.totalProducts > 0);
    assert.ok(dash.data.metrics.totalCategories > 0);
    console.log(`✅ Dashboard metrics retrieved: ${dash.data.metrics.totalProducts} products, ${dash.data.metrics.totalCategories} categories.`);

    // 7. Product Management CRUD
    console.log('Test 7: Admin Product Management CRUD...');
    const newProd = {
      name: 'Test Artisan Blossom Brooch',
      tagline: 'Hand-carved mother of pearl brooch',
      price: 899,
      originalPrice: 1199,
      category: 'handmade-crafts',
      categoryName: 'Handmade Crafts',
      description: 'Exclusive artisanal piece created for studio test verification.',
      stockCount: 12,
      inStock: true,
      isPublished: true,
    };

    // Create
    const createProd = await request(
      {
        path: '/api/admin/products',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${updatedToken}` },
      },
      newProd
    );
    assert.strictEqual(createProd.status, 201);
    const createdId = createProd.data.product.id;
    assert.ok(createdId);

    // Verify in public storefront
    const pubProd = await request({ path: `/api/products/${createdId}`, method: 'GET' });
    assert.strictEqual(pubProd.status, 200);
    assert.strictEqual(pubProd.data.product.name, 'Test Artisan Blossom Brooch');

    // Update
    const updateProd = await request(
      {
        path: `/api/admin/products/${createdId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${updatedToken}` },
      },
      { price: 799, stockCount: 4 }
    );
    assert.strictEqual(updateProd.status, 200);
    assert.strictEqual(updateProd.data.product.price, 799);

    // Delete
    const deleteProd = await request({
      path: `/api/admin/products/${createdId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${updatedToken}` },
    });
    assert.strictEqual(deleteProd.status, 200);

    // Verify deleted from storefront
    const verifyDel = await request({ path: `/api/products/${createdId}`, method: 'GET' });
    assert.strictEqual(verifyDel.status, 404);
    console.log('✅ Product creation, public sync, price update, and deletion verified.');

    // 8. Image Upload with validation
    console.log('Test 8: Secure image upload endpoint...');
    const fakePixelPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const uploadRes = await request(
      {
        path: '/api/admin/upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${updatedToken}` },
      },
      { filename: 'test-rose.png', mimeType: 'image/png', data: fakePixelPng }
    );
    assert.strictEqual(uploadRes.status, 201);
    assert.ok(uploadRes.data.url.startsWith('/uploads/'));
    console.log(`✅ Secure image upload verified: ${uploadRes.data.url}`);

    // 9. Homepage Content Management
    console.log('Test 9: Homepage content editor...');
    const updateHome = await request(
      {
        path: '/api/admin/content/homepage',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${updatedToken}` },
      },
      {
        hero: {
          headline: 'Artisanal Gifts for Gentle Souls',
          subtitle: 'Updated via ELARA & CO. Admin Panel Live Editor',
          image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1920&q=85',
          primaryButtonText: 'Shop New Arrivals',
          primaryButtonLink: '/shop?sort=new-arrivals',
          secondaryButtonText: 'Explore Bouquets',
          secondaryButtonLink: '/shop?category=aesthetic-bouquets',
        },
      }
    );
    assert.strictEqual(updateHome.status, 200);

    const publicHome = await request({ path: '/api/content/homepage', method: 'GET' });
    assert.strictEqual(publicHome.data.homepage.hero.headline, 'Artisanal Gifts for Gentle Souls');
    console.log('✅ Homepage content editor verified with live storefront synchronization.');

    // 10. Order Placement & Admin Status Management
    console.log('Test 10: Order lifecycle & admin status updates...');
    const orderRes = await request(
      { path: '/api/orders', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {
        items: [{ product: { id: 'elara-hb-01', name: 'Freshwater Pearl Bracelet', price: 449 }, quantity: 1 }],
        customer: { fullName: 'Priya Verma', email: 'priya.verma@example.com', phone: '9876543210', city: 'Mumbai', pincode: '400001' },
        subtotal: 449,
        discount: 0,
        shippingFee: 79,
        total: 528,
        paymentMethod: 'UPI',
      }
    );
    assert.strictEqual(orderRes.status, 201);
    const testOrderId = orderRes.data.order.orderId;
    assert.strictEqual(orderRes.data.order.status, 'Pending');

    // Admin updates status to Shipped
    const statusUpdate = await request(
      {
        path: `/api/admin/orders/${testOrderId}/status`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${updatedToken}` },
      },
      { status: 'Shipped' }
    );
    assert.strictEqual(statusUpdate.status, 200);
    assert.strictEqual(statusUpdate.data.order.status, 'Shipped');
    console.log('✅ Order creation and admin status transition (Pending -> Shipped) verified.');

    // 11. Unified Login via /api/auth/login with Admin Credentials (Elara@2026)
    console.log('Test 11: Unified Login endpoint with admin password Elara@2026...');
    await resetAdminCredentials('hey.dhruva20@gmail.com');
    const unifiedAdmin = await request(
      { path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'hey.dhruva20@gmail.com', password: 'Elara@2026' }
    );
    assert.strictEqual(unifiedAdmin.status, 200);
    assert.strictEqual(unifiedAdmin.data.success, true);
    assert.strictEqual(unifiedAdmin.data.role, 'admin');
    assert.ok(unifiedAdmin.data.token);
    assert.strictEqual(unifiedAdmin.data.admin.email, 'hey.dhruva20@gmail.com');
    console.log('✅ Unified storefront login verified for admin with Elara@2026.');

    console.log('\n🎉 ALL 11 EXTENSIVE ADMIN & STOREFRONT BACKEND TESTS PASSED WITH 100% SUCCESS!');
  } finally {
    await resetAdminCredentials('supreethr101105@gmail.com');
    await resetAdminCredentials('hey.dhruva20@gmail.com');
    if (server.listening) {
      server.close();
    }
  }
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
