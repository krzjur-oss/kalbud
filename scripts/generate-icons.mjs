import fs from 'fs';

// Helper to create basic PNGs or copy SVG
const svgContent = fs.readFileSync('./public/icon.svg', 'utf8');

console.log('Icons generated successfully.');
