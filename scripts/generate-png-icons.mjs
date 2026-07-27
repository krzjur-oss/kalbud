import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

function createKalbudIcon(size) {
  const png = new PNG({ width: size, height: size });

  // Colors RGBA
  const bg = [15, 23, 42, 255]; // #0f172a
  const blue = [59, 130, 246, 255]; // #3b82f6
  const gold = [245, 158, 11, 255]; // #f59e0b
  const white = [255, 255, 255, 255];
  const gridLine = [255, 255, 255, 15];

  const cornerRadius = size * 0.22;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Check rounded rect boundary
      let inside = true;
      const rx = Math.min(x, size - 1 - x);
      const ry = Math.min(y, size - 1 - y);

      if (rx < cornerRadius && ry < cornerRadius) {
        const dx = cornerRadius - rx;
        const dy = cornerRadius - ry;
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
          inside = false;
        }
      }

      if (!inside) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0; // Transparent outside
        continue;
      }

      // Default background
      let r = bg[0], g = bg[1], b = bg[2], a = bg[3];

      // Subtle grid pattern
      if (x % Math.floor(size / 6) === 0 || y % Math.floor(size / 6) === 0) {
        r = Math.min(255, r + 15);
        g = Math.min(255, g + 20);
        b = Math.min(255, b + 30);
      }

      // Draw Roof Triangle (Blue)
      const centerX = size / 2;
      const roofTopY = size * 0.2;
      const roofBottomY = size * 0.45;
      const roofHalfWidth = size * 0.35;

      // Distance to roof edge
      const slope = (roofBottomY - roofTopY) / roofHalfWidth;
      const currentXDist = Math.abs(x - centerX);
      const expectedY = roofTopY + currentXDist * slope;

      const roofThickness = size * 0.05;
      if (y >= expectedY - roofThickness / 2 && y <= expectedY + roofThickness / 2 && y <= roofBottomY && currentXDist <= roofHalfWidth + roofThickness / 2) {
        r = blue[0]; g = blue[1]; b = blue[2]; a = blue[3];
      }

      // House Body Box (White outline)
      const bodyLeft = size * 0.22;
      const bodyRight = size * 0.78;
      const bodyTop = size * 0.45;
      const bodyBottom = size * 0.72;
      const borderWidth = size * 0.04;

      if (x >= bodyLeft && x <= bodyRight && y >= bodyTop && y <= bodyBottom) {
        // Outer border
        const isBorder = (x < bodyLeft + borderWidth || x > bodyRight - borderWidth || y > bodyBottom - borderWidth);
        if (isBorder) {
          r = blue[0]; g = blue[1]; b = blue[2]; a = blue[3];
        } else {
          // Inner fill - Golden center badge
          const innerLeft = size * 0.35;
          const innerRight = size * 0.65;
          const innerTop = size * 0.50;
          const innerBottom = size * 0.68;
          if (x >= innerLeft && x <= innerRight && y >= innerTop && y <= innerBottom) {
            r = gold[0]; g = gold[1]; b = gold[2]; a = gold[3];

            // "K" in center of golden box
            const kCenterX = size * 0.5;
            const kWidth = size * 0.025;
            // Vertical bar of K
            if (Math.abs(x - (size * 0.43)) < kWidth) {
              r = white[0]; g = white[1]; b = white[2]; a = white[3];
            }
            // Diagonal branches of K
            const distY = Math.abs(y - (size * 0.59));
            const expectedKX = size * 0.43 + distY * 0.9;
            if (Math.abs(x - expectedKX) < kWidth && x >= size * 0.43 && x <= size * 0.58) {
              r = white[0]; g = white[1]; b = white[2]; a = white[3];
            }
          }
        }
      }

      // Foundation Bar (Gold bottom bar)
      const barLeft = size * 0.15;
      const barRight = size * 0.85;
      const barTop = size * 0.76;
      const barBottom = size * 0.84;

      if (x >= barLeft && x <= barRight && y >= barTop && y <= barBottom) {
        r = gold[0]; g = gold[1]; b = gold[2]; a = gold[3];
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return png;
}

const icon192 = createKalbudIcon(192);
icon192.pack().pipe(fs.createWriteStream(path.join(process.cwd(), 'public', 'icon-192.png'))).on('finish', () => {
  console.log('Successfully created public/icon-192.png');
});

const icon512 = createKalbudIcon(512);
icon512.pack().pipe(fs.createWriteStream(path.join(process.cwd(), 'public', 'icon-512.png'))).on('finish', () => {
  console.log('Successfully created public/icon-512.png');
});
