const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { Upload, Download, FileText, FileSpreadsheet, MessageCircle, Menu, X, Clock, Settings, Save, Plus, ArrowRight, Edit, Check } from 'lucide-react';",
  "import { Upload, Download, FileText, FileSpreadsheet, MessageCircle, Menu, X, Clock, Settings, Save, Plus, ArrowRight, Edit, Check, Trash2 } from 'lucide-react';"
);

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

const deleteBtn = `             {employeesData.length > 0 && (
                <button
                   onClick={toggleSelectAll}
                   className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                 >
                   {allSelected ? 'إلغاء تحديد الكل' : 'تحديد جميع اللاينات'}
                 </button>
             )}
             {hasSelected && (
                <button
                   onClick={handleDeleteSelected}
                   className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
                 >
                   <Trash2 className="w-4 h-4" /> حذف المحددة
                 </button>
             )}`;

code = code.replace(/             \{employeesData\.length > 0 && \([\s\S]*?<\/button>\n             \)\}/, deleteBtn);

fs.writeFileSync('src/App.tsx', code);
