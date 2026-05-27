const fs = require('fs');
let content = fs.readFileSync('src/components/ForumFeedModule.tsx', 'utf8');

const replacements = [
  { from: /bg-\[#000000\]/g, to: 'bg-slate-50' },
  { from: /bg-\[#0b1416\]/g, to: 'bg-white' },
  { from: /border-\[#2a3236\]/g, to: 'border-slate-200' },
  { from: /bg-\[#1a282d\]/g, to: 'bg-slate-100' },
  { from: /bg-\[#2a3236\]/g, to: 'bg-slate-200' },
  { from: /text-\[#d7dadc\]/g, to: 'text-slate-700' },
  { from: /text-\[#f2f4f5\]/g, to: 'text-slate-900' },
  { from: /text-\[#8b9296\]/g, to: 'text-slate-500' },
  { from: /bg-\[#0f1a1c\]/g, to: 'bg-white' },
  { from: /text-\[#0f1a1c\]/g, to: 'text-white' },
  { from: /bg-\[#d7dadc\]/g, to: 'bg-slate-800' },
  { from: /border-transparent/g, to: 'border-transparent' },
  { from: /focus:border-\[#d7dadc\]/g, to: 'focus:border-slate-300 focus:ring-1 focus:ring-slate-300' },
  { from: /focus-within:border-\[#d7dadc\]/g, to: 'focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-300' },
  { from: /hover:text-\[#d7dadc\]/g, to: 'hover:text-slate-800' },
  { from: /placeholder-\[#8b9296\]/g, to: 'placeholder-slate-400' },
  { from: /hover:bg-white/g, to: 'hover:bg-slate-900' },
  { from: /hover:bg-\[#131f24\]/g, to: 'hover:bg-slate-50' },
  { from: /bg-\[rgba\(255,255,255,0\.05\)\]/g, to: 'bg-slate-50' },
  { from: /border-\[rgba\(255,255,255,0\.05\)\]/g, to: 'border-slate-100' },
  { from: /bg-\[#343a40\]/g, to: 'bg-slate-200' }, // comment lines
  { from: /group-hover\/line:bg-\[#8b9296\]/g, to: 'group-hover/line:bg-slate-400' },
  { from: /group-hover:text-\[#fff\]/g, to: 'group-hover:text-slate-900' },
  { from: /group-focus-within:text-\[#fff\]/g, to: 'group-focus-within:text-slate-900' }
];

replacements.forEach(r => {
  content = content.replace(r.from, r.to);
});

fs.writeFileSync('src/components/ForumFeedModule.tsx', content);
