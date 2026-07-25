const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newSave = `  const saveCurrentData = (data: Employee[], cycle: string) => {
    if (data.length === 0) return;
    const saved = JSON.parse(localStorage.getItem('morattaba_saved_months') || '{}');
    saved[cycle] = data;
    localStorage.setItem('morattaba_saved_months', JSON.stringify(saved));
    setSavedMonths(saved);
    
    const match = cycle.match(/\\d{4}$/);
    const year = match ? match[0] : new Date().getFullYear().toString();
    setExpandedYears(prev => ({ ...prev, [year]: true }));
  };`;

code = code.replace(/  const saveCurrentData = \(\data: Employee\[\], cycle: string\) => \{\n    if \(data\.length === 0\) return;\n    const saved = JSON\.parse\(localStorage\.getItem\('morattaba_saved_months'\) \|\| '\{\}'\);\n    saved\[cycle\] = data;\n    localStorage\.setItem\('morattaba_saved_months', JSON\.stringify\(saved\)\);\n    setSavedMonths\(saved\);\n  \};/, newSave);

fs.writeFileSync('src/App.tsx', code);
