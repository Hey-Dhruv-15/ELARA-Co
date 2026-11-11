import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { readCollection, writeCollection } from './db.mjs';
import { pool, isPgReady } from './postgres.mjs';

// The strictly authorized administrator emails
export const AUTHORIZED_ADMIN_EMAILS = [
  'supreethr101105@gmail.com',
  'laasyaarun18@gmail.com',
  'akankssha.mgr@gmail.com',
  'hey.dhruva20@gmail.com',
].map((e) => e.toLowerCase().trim());

const INITIAL_PASSWORD = 'Elara@2026';
const TOKEN_SECRET = process.env.ADMIN_JWT_SECRET || 'elara_co_secret_key_rosewater_champagne_2026';

// Rate limiting in-memory store
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

// Active invalidated tokens (denylist)
const invalidatedTokens = new Set();

/**
 * Initialize / provision the 4 authorized administrators in PostgreSQL & JSON
 */
export async function ensureAdminsProvisioned() {
  const admins = readCollection('admins', []);
  let changed = false;

  for (const email of AUTHORIZED_ADMIN_EMAILS) {
    const existing = admins.find((a) => a.email.toLowerCase() === email);
    if (!existing) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(INITIAL_PASSWORD, salt);
      const name = email.split('@')[0].replace('.', ' ');
      admins.push({
        id: `adm_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        role: 'admin',
        passwordHash,
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
      });
      changed = true;
    }
  }

  if (changed || admins.length === 0) {
    writeCollection('admins', admins);
  }

  // Also verify in PostgreSQL
  try {
    const res = await pool.query('SELECT COUNT(*) FROM admins');
    if (parseInt(res.rows[0].count) === 0) {
      for (const adm of admins) {
        await pool.query(
          `INSERT INTO admins (id, email, name, role, password_hash, must_change_password, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (email) DO NOTHING`,
          [adm.id, adm.email.toLowerCase(), adm.name, adm.role, adm.passwordHash, adm.mustChangePassword, adm.createdAt]
        );
      }
    }
  } catch (e) {
    // pg might be offline
  }
}

/**
 * Check if identifier is currently rate limited
 */
export function checkRateLimit(identifier) {
  const record = loginAttempts.get(identifier);
  if (!record) return { limited: false };

  if (Date.now() < record.lockUntil) {
    const remainingMinutes = Math.ceil((record.lockUntil - Date.now()) / 60000);
    return {
      limited: true,
      error: `Too many failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
    };
  }

  if (Date.now() >= record.lockUntil) {
    loginAttempts.delete(identifier);
  }
  return { limited: false };
}

export function recordFailedAttempt(identifier) {
  const record = loginAttempts.get(identifier) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCKOUT_PERIOD_MS;
  }
  loginAttempts.set(identifier, record);
  return { attemptsLeft: Math.max(0, MAX_ATTEMPTS - record.attempts), locked: record.attempts >= MAX_ATTEMPTS };
}

export function resetLoginAttempts(identifier) {
  loginAttempts.delete(identifier);
}

export function generateToken(admin) {
  const payload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    mustChangePassword: admin.mustChangePassword,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  if (invalidatedTokens.has(token)) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) return null;

    const admins = readCollection('admins', []);
    const admin = admins.find((a) => a.id === payload.id);
    if (!admin) return null;

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      mustChangePassword: admin.mustChangePassword,
    };
  } catch {
    return null;
  }
}

export function invalidateToken(token) {
  if (token) {
    invalidatedTokens.add(token);
  }
}

/**
 * Authenticate administrator with email and password
 */
export async function authenticateAdmin(email, password, identifier) {
  await ensureAdminsProvisioned();

  const cleanEmail = (email || '').toLowerCase().trim();
  const rateLimitStatus = checkRateLimit(identifier || cleanEmail);
  if (rateLimitStatus.limited) {
    return { success: false, status: 429, error: rateLimitStatus.error };
  }

  if (!AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)) {
    recordFailedAttempt(identifier || cleanEmail);
    return { success: false, status: 401, error: 'Invalid credentials or unauthorized administrator email.' };
  }

  let admin = null;

  // Try PostgreSQL first
  try {
    const res = await pool.query('SELECT * FROM admins WHERE LOWER(email) = $1', [cleanEmail]);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      admin = {
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        passwordHash: row.password_hash,
        mustChangePassword: Boolean(row.must_change_password),
      };
    }
  } catch (e) {
    // Fallback to JSON
  }

  if (!admin) {
    const admins = readCollection('admins', []);
    admin = admins.find((a) => a.email.toLowerCase() === cleanEmail);
  }

  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    const attemptInfo = recordFailedAttempt(identifier || cleanEmail);
    const msg = attemptInfo.locked
      ? 'Too many failed login attempts. Your account has been temporarily locked for 15 minutes.'
      : `Invalid credentials. ${attemptInfo.attemptsLeft} attempts remaining.`;
    return { success: false, status: 401, error: msg };
  }

  // Success - reset attempts
  resetLoginAttempts(identifier || cleanEmail);

  // Update last login in PostgreSQL and JSON
  try {
    await pool.query('UPDATE admins SET last_login = NOW() WHERE id = $1', [admin.id]);
  } catch (e) {}

  const admins = readCollection('admins', []);
  const fileAdmin = admins.find((a) => a.id === admin.id);
  if (fileAdmin) {
    fileAdmin.lastLogin = new Date().toISOString();
    writeCollection('admins', admins);
  }

  const token = generateToken(admin);

  return {
    success: true,
    status: 200,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      mustChangePassword: Boolean(admin.mustChangePassword),
    },
    token,
  };
}

/**
 * Change administrator password
 */
export async function changeAdminPassword(adminId, currentPassword, newPassword) {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, status: 400, error: 'New password must be at least 8 characters long.' };
  }

  if (newPassword === INITIAL_PASSWORD) {
    return {
      success: false,
      status: 400,
      error: 'You cannot reuse the default temporary password. Please choose a new secure password.',
    };
  }

  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigitOrSpecial = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  if (!hasUpper || !hasLower || !hasDigitOrSpecial) {
    return {
      success: false,
      status: 400,
      error: 'Password must contain uppercase letters, lowercase letters, and at least one number or special character.',
    };
  }

  let admin = null;
  const admins = readCollection('admins', []);
  admin = admins.find((a) => a.id === adminId);

  // Try PostgreSQL
  try {
    const res = await pool.query('SELECT * FROM admins WHERE id = $1', [adminId]);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      admin = {
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        passwordHash: row.password_hash,
        mustChangePassword: Boolean(row.must_change_password),
      };
    }
  } catch (e) {}

  if (!admin) {
    return { success: false, status: 404, error: 'Administrator not found.' };
  }

  if (!bcrypt.compareSync(currentPassword, admin.passwordHash)) {
    return { success: false, status: 400, error: 'Incorrect current password.' };
  }

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPassword, salt);
  admin.passwordHash = newHash;
  admin.mustChangePassword = false;

  // Update in PostgreSQL
  try {
    await pool.query(
      'UPDATE admins SET password_hash = $1, must_change_password = FALSE WHERE id = $2',
      [newHash, adminId]
    );
  } catch (e) {}

  // Update in JSON
  const fileAdmin = admins.find((a) => a.id === adminId);
  if (fileAdmin) {
    fileAdmin.passwordHash = newHash;
    fileAdmin.mustChangePassword = false;
    fileAdmin.passwordChangedAt = new Date().toISOString();
    writeCollection('admins', admins);
  }

  const newToken = generateToken(admin);

  return {
    success: true,
    status: 200,
    message: 'Password updated successfully.',
    token: newToken,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      mustChangePassword: false,
    },
  };
}

/**
 * Reset an admin's password and flag (for maintenance/testing)
 */
export async function resetAdminCredentials(email, password = INITIAL_PASSWORD, mustChange = true) {
  const normEmail = email.toLowerCase().trim();
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  try {
    await pool.query(
      'UPDATE admins SET password_hash = $1, must_change_password = $2 WHERE LOWER(email) = $3',
      [passwordHash, mustChange, normEmail]
    );
  } catch (e) {}

  const admins = readCollection('admins', []);
  const admin = admins.find((a) => a.email.toLowerCase() === normEmail);
  if (admin) {
    admin.passwordHash = passwordHash;
    admin.mustChangePassword = mustChange;
    writeCollection('admins', admins);
  }
  // Clear rate limits
  loginAttempts.clear();
}
