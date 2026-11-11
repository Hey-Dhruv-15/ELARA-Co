import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[35m%s\x1b[0m', '═══════════════════════════════════════════════════════════════');
console.log('\x1b[1m\x1b[35m%s\x1b[0m', '   🌸 ELARA & CO. — Development Environment Runner');
console.log('\x1b[35m%s\x1b[0m', '   Starting Backend API (Port 3001) + Vite Dev Server (Port 5173)');
console.log('\x1b[35m%s\x1b[0m', '═══════════════════════════════════════════════════════════════\n');

function pipePrefixed(child, prefix, colorCode) {
  function formatLine(line) {
    if (!line.trim()) return;
    process.stdout.write(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}\n`);
  }

  child.stdout.on('data', (chunk) => {
    const lines = chunk.toString().split(/\r?\n/);
    lines.forEach((line) => {
      if (line.length > 0) formatLine(line);
    });
  });

  child.stderr.on('data', (chunk) => {
    const lines = chunk.toString().split(/\r?\n/);
    lines.forEach((line) => {
      if (line.length > 0) formatLine(line);
    });
  });
}

// 1. Launch Backend API Server
const serverScript = path.join(__dirname, 'index.mjs');
const serverProc = spawn(process.execPath, [serverScript], {
  cwd: rootDir,
  env: { ...process.env, PORT: '3001' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
pipePrefixed(serverProc, 'backend', '36'); // Cyan

// 2. Launch Vite Dev Server
const viteScript = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const viteProc = spawn(process.execPath, [viteScript], {
  cwd: rootDir,
  env: { ...process.env },
  stdio: ['inherit', 'pipe', 'pipe'],
});
pipePrefixed(viteProc, 'vite', '32'); // Green

function cleanup() {
  console.log('\n\x1b[33mShutting down ELARA & CO. dev processes...\x1b[0m');
  try {
    serverProc.kill('SIGINT');
  } catch (e) {}
  try {
    viteProc.kill('SIGINT');
  } catch (e) {}
  setTimeout(() => process.exit(0), 500);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

serverProc.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[backend] Exited with code ${code}\x1b[0m`);
  }
});

viteProc.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[vite] Exited with code ${code}\x1b[0m`);
  }
});

