const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCycleBtn = `                            <button
                              key={cycle}
                              onClick={() => loadMonth(cycle)}
                              className="w-full text-right p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center gap-3 bg-white"
                            >
                              <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
                              <div>
                                <div className="font-bold text-slate-700 text-sm">{cycle}</div>
                                <div className="text-xs text-slate-500 mt-1">{savedMonths[cycle].length} موظف</div>
                              </div>
                            </button>`;

const newCycleBtn = `                            <div key={cycle} className="relative group w-full flex rounded-lg border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50 transition-colors overflow-hidden">
                              <button
                                onClick={() => loadMonth(cycle)}
                                className="flex-1 text-right p-3 flex items-center gap-3"
                              >
                                <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
                                <div>
                                  <div className="font-bold text-slate-700 text-sm">{cycle}</div>
                                  <div className="text-xs text-slate-500 mt-1">{savedMonths[cycle].length} موظف</div>
                                </div>
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteCycle(cycle); }}
                                className="p-3 text-rose-500 hover:bg-rose-100 transition-colors flex items-center justify-center shrink-0"
                                title="حذف السجل"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>`;

code = code.replace(oldCycleBtn, newCycleBtn);
fs.writeFileSync('src/App.tsx', code);
