import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

export function readCollection(collection, fallback = []) {
  const filePath = getFilePath(collection);
  try {
    if (!fs.existsSync(filePath)) {
      writeCollection(collection, fallback);
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    return fallback;
  }
}

export function writeCollection(collection, data) {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${collection}:`, err);
    return false;
  }
}

