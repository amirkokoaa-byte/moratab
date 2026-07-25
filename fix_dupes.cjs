const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// fix double handleDeleteSelected definition
code = code.replace(/  const handleDeleteSelected = \(\) => \{\n    if \(window\.confirm\('هل تريد بالتأكيد حذف السجلات المحددة\؟ \(نعم للحذف، لا للإلغاء\)'\)\) \{\n      const remaining = employeesData\.filter\(emp => !emp\.selected\)\.map\(\(emp, i\) => \(\{ \.\.\.emp, serial: i \+ 1 \}\)\);\n      setEmployeesData\(remaining\);\n      saveCurrentData\(remaining, selectedCycle\);\n      setAllSelected\(false\);\n    \}\n  \};\n\n/g, "");
const deleteFunc = `  const handleDeleteSelected = () => {
    if (window.confirm('هل تريد بالتأكيد حذف السجلات المحددة؟ (نعم للحذف، لا للإلغاء)')) {
      const remaining = employeesData.filter(emp => !emp.selected).map((emp, i) => ({ ...emp, serial: i + 1 }));
      setEmployeesData(remaining);
      saveCurrentData(remaining, selectedCycle);
      setAllSelected(false);
    }
  };

  const handleEditClick`;

code = code.replace("  const handleEditClick", deleteFunc);


// fix double button
code = code.replace(/             \{hasSelected && \(\n                <button\n                   onClick=\{handleDeleteSelected\}\n                   className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1\.5 rounded text-xs font-bold transition-colors flex items-center gap-1"\n                 >\n                   <Trash2 className="w-4 h-4" \/> حذف المحددة\n                 <\/button>\n             \)\}\n/g, "");

const deleteBtn = `             {hasSelected && (
                <button
                   onClick={handleDeleteSelected}
                   className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
                 >
                   <Trash2 className="w-4 h-4" /> حذف المحددة
                 </button>
             )}
          </div>`;

code = code.replace(/          <\/div>\n          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">/g, deleteBtn + '\n          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">');

fs.writeFileSync('src/App.tsx', code);
