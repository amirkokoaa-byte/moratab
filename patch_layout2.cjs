const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('<div className="flex flex-col h-screen w-full bg-slate-50 text-slate-800 font-sans" dir="rtl">', '<div className="flex flex-col min-h-screen md:h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-x-hidden" dir="rtl">');

code = code.replace('<div className="flex-1 mx-4 mb-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">', '<div className="flex-1 mx-2 sm:mx-4 mb-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[500px] md:min-h-0">');

// Make the KPI grid a bit more compact on mobile
code = code.replace('<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 shrink-0">', '<div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4 shrink-0">');

code = code.replace('<div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">', '<div className="bg-white p-2 sm:p-3 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">');

fs.writeFileSync('src/App.tsx', code);
