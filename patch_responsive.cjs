const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Make the table horizontally scrollable by adding a minimum width
code = code.replace('<table className="w-full text-xs text-right border-collapse">', '<table className="w-full min-w-[900px] text-xs text-right border-collapse">');

code = code.replace(
  '<thead className="bg-slate-900 text-white sticky top-0 z-10">',
  '<thead className="bg-slate-900 text-white sticky top-0 z-10 whitespace-nowrap">'
);

fs.writeFileSync('src/App.tsx', code);
