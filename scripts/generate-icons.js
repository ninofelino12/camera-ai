const fs = require('fs');
const path = require('path');

// Simple SVG to create PNG icons
const icon192 = `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="40" fill="url(#grad)"/>
  <circle cx="96" cy="96" r="45" fill="none" stroke="white" stroke-width="5"/>
  <circle cx="96" cy="96" r="22" fill="white"/>
  <rect x="68" y="38" width="56" height="30" rx="8" fill="white"/>
</svg>`).toString('base64')}`;

const icon512 = `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#grad)"/>
  <circle cx="256" cy="256" r="120" fill="none" stroke="white" stroke-width="12"/>
  <circle cx="256" cy="256" r="60" fill="white"/>
  <rect x="180" y="100" width="152" height="80" rx="20" fill="white"/>
</svg>`).toString('base64')}`;

console.log('Icon SVGs created. Note: For production, convert these to actual PNG files.');
console.log('Icon 192:', icon192.substring(0, 100) + '...');
console.log('Icon 512:', icon512.substring(0, 100) + '...');
