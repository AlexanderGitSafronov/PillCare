#!/usr/bin/env node
// Run: node scripts/generate-icons.js
// Generates simple SVG-based PNG icons for the PWA
// For production, replace with proper branded icons

const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, "../public/icons");

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create SVG icon
function createSVG(size) {
  const r = Math.round(size * 0.22); // border radius
  const pill = size * 0.25;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#4F8EF7"/>
  <text x="${size/2}" y="${size * 0.67}" font-size="${size * 0.55}" text-anchor="middle" fill="white" font-family="system-ui, sans-serif">💊</text>
</svg>`;
}

sizes.forEach((size) => {
  const svg = createSVG(size);
  const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Created ${filename}`);
});

// Create a placeholder PNG info file
fs.writeFileSync(
  path.join(iconsDir, "README.md"),
  `# PWA Icons

Replace these placeholder SVG icons with proper PNG icons for production.

Required sizes: ${sizes.join(", ")}

You can use tools like:
- https://realfavicongenerator.net/
- https://pwabuilder.com/
- \`sharp\` npm package for programmatic generation
`
);

console.log("✅ Icons generated");
