/**
 * Generate PWA icons from the source SVG icon.
 * Run: bun scripts/generate-icons.ts
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(new URL(".", import.meta.url).pathname, "..");
const svgInput = readFileSync(join(ROOT, "src/app/icon.svg"));

const sizes = [
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

async function generateIcons() {
  for (const { name, size } of sizes) {
    await sharp(svgInput)
      .resize(size, size)
      .png()
      .toFile(join(ROOT, "public", name));
    console.log(`Generated public/${name} (${size}x${size})`);
  }

  // Maskable icon: add padding (safe zone is inner 80%)
  const maskableSize = 512;
  const iconSize = Math.round(maskableSize * 0.7);
  const padding = Math.round((maskableSize - iconSize) / 2);

  const iconBuffer = await sharp(svgInput)
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 28, g: 25, b: 23, alpha: 1 }, // #1c1917
    },
  })
    .composite([{ input: iconBuffer, left: padding, top: padding }])
    .png()
    .toFile(join(ROOT, "public", "maskable-icon-512x512.png"));

  console.log(`Generated public/maskable-icon-512x512.png (512x512 maskable)`);
}

generateIcons().catch(console.error);
