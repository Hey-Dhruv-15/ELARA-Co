import { Jimp } from 'jimp';

async function cropAndEnhance() {
  const img = await Jimp.read('public/logo.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const d = img.bitmap.data;

  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = d[(y * w + x) * 4 + 3];
      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Add 10px padding
  const pad = 12;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(w - cropX, (maxX - minX) + pad * 2);
  const cropH = Math.min(h - cropY, (maxY - minY) + pad * 2);

  console.log(`Cropping to ${cropW}x${cropH} at (${cropX}, ${cropY})`);

  // Crop full logo
  img.crop({ x: cropX, y: cropY, w: cropW, h: cropH });
  await img.write('public/logo.png');
  await img.write('src/assets/logo.png');

  // Also create a standalone flower icon for mark/favicon
  const flowerImg = await Jimp.read('public/logo-raw.jpg');
  // In the raw image, the flower is at the top right, from roughly x: 340 to 680, y: 60 to 350
  // Let's sample and crop the flower specifically
  const flowerW = 340;
  const flowerH = 300;
  flowerImg.crop({ x: 345, y: 60, w: flowerW, h: flowerH });

  const fData = flowerImg.bitmap.data;
  const avgR = 252, avgG = 239, avgB = 234;
  for (let y = 0; y < flowerH; y++) {
    for (let x = 0; x < flowerW; x++) {
      const idx = (y * flowerW + x) * 4;
      const r = fData[idx];
      const g = fData[idx + 1];
      const b = fData[idx + 2];
      const dist = Math.sqrt(Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2));
      if (dist <= 22) {
        fData[idx + 3] = 0;
      } else if (dist < 40) {
        fData[idx + 3] = Math.round(255 * ((dist - 22) / 18));
      }
    }
  }
  await flowerImg.write('public/logo-flower.png');
  await flowerImg.write('src/assets/logo-flower.png');

  console.log('Finished generating transparent logo assets!');
}

cropAndEnhance().catch(console.error);

