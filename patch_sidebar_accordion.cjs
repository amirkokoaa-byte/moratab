const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { Upload, Download, FileText, FileSpreadsheet, MessageCircle, Menu, X, Clock, Settings, Save, Plus, ArrowRight, Edit, Check, Trash2 } from 'lucide-react';",
  "import { Upload, Download, FileText, FileSpreadsheet, MessageCircle, Menu, X, Clock, Settings, Save, Plus, ArrowRight, Edit, Check, Trash2, ChevronDown, ChevronLeft } from 'lucide-react';"
);

const stateCode = `  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({ [new Date().getFullYear().toString()]: true });`;
code = code.replace("  const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n  const [isSettingsOpen, setIsSettingsOpen] = useState(false);", stateCode);


const renderCode = `            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              {Object.keys(savedMonths).length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-10">لا توجد سجلات محفوظة حالياً</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    Object.keys(savedMonths).reduce((acc: Record<string, string[]>, cycle) => {
                      const match = cycle.match(/\\d{4}$/);
                      const year = match ? match[0] : new Date().getFullYear().toString();
                      if (!acc[year]) acc[year] = [];
                      acc[year].push(cycle);
                      return acc;
                    }, {})
                  )
                  .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA)) // Descending year
                  .map(([year, cycles]) => (
                    <div key={year} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }))}
                        className="w-full flex items-center justify-between p-3 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <h3 className="font-bold text-slate-800">عام {year}</h3>
                        {expandedYears[year] ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronLeft className="w-5 h-5 text-slate-500" />}
                      </button>
                      {expandedYears[year] && (
                        <div className="p-2 space-y-2 bg-slate-50">
                          {cycles.map((cycle) => (
                            <button
                              key={cycle}
                              onClick={() => loadMonth(cycle)}
                              className="w-full text-right p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center gap-3 bg-white"
                            >
                              <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
                              <div>
                                <div className="font-bold text-slate-700 text-sm">{cycle}</div>
                                <div className="text-xs text-slate-500 mt-1">{savedMonths[cycle].length} موظف</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>`;

code = code.replace(/            <div className="p-4 overflow-y-auto h-\[calc\(100\%-60px\)\]">\n              \{Object\.keys\(savedMonths\)\.length === 0 \? \(\n                <p className="text-slate-500 text-sm text-center mt-10">لا توجد سجلات محفوظة حالياً<\/p>\n              \) : \(\n                <div className="space-y-2">\n                  \{Object\.keys\(savedMonths\)\.map\(\(cycle\) => \(\n                    <button\n                      key=\{cycle\}\n                      onClick=\{\(\) => loadMonth\(cycle\)\}\n                      className="w-full text-right p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center gap-3"\n                    >\n                      <Clock className="w-5 h-5 text-indigo-500 shrink-0" \/>\n                      <div>\n                        <div className="font-bold text-slate-700 text-sm">\{cycle\}<\/div>\n                        <div className="text-xs text-slate-500 mt-1">\{savedMonths\[cycle\]\.length\} موظف<\/div>\n                      <\/div>\n                    <\/button>\n                  \)\)\}\n                <\/div>\n              \)\}\n            <\/div>/, renderCode);

fs.writeFileSync('src/App.tsx', code);
