const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const sidebarCode = `
      {/* Sidebar */}
      <div className={\`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out \${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}\`}>
        {isSettingsOpen ? (
          <>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="font-bold text-lg text-slate-800">إعدادات الأرقام</h2>
              </div>
              <button onClick={() => { setIsSettingsOpen(false); setIsSidebarOpen(false); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)] bg-slate-50">
              <div className="space-y-4">
                {contacts.map((contact, idx) => (
                  <div key={contact.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2">
                    <input 
                      type="text" 
                      value={contact.name}
                      onChange={(e) => {
                        const newContacts = [...contacts];
                        newContacts[idx].name = e.target.value;
                        saveContacts(newContacts);
                      }}
                      placeholder="اسم الموظف"
                      className="text-sm font-bold bg-transparent border-none outline-none w-full text-slate-800"
                    />
                    <input 
                      type="text" 
                      value={contact.phone}
                      onChange={(e) => {
                        const newContacts = [...contacts];
                        newContacts[idx].phone = e.target.value;
                        saveContacts(newContacts);
                      }}
                      placeholder="رقم الواتساب (مثال: 201xxxxxxxxx)"
                      className="text-xs bg-slate-100 p-2 rounded border border-slate-200 outline-none focus:border-indigo-400 w-full text-slate-700"
                      dir="ltr"
                    />
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newContacts = [...contacts, { id: Date.now().toString(), name: 'موظف جديد', phone: '' }];
                    saveContacts(newContacts);
                  }}
                  className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> إضافة اسم جديد
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg text-slate-800">مرتبات الأشهر</h2>
              <div className="flex items-center gap-1">
                <button onClick={handleSettingsClick} className="p-2 hover:bg-slate-200 rounded-full transition-colors" title="الإعدادات">
                  <Settings className="w-5 h-5 text-slate-500" />
                </button>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors" title="إغلاق">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              {Object.keys(savedMonths).length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-10">لا توجد سجلات محفوظة حالياً</p>
              ) : (
                <div className="space-y-2">
                  {Object.keys(savedMonths).map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => loadMonth(cycle)}
                      className="w-full text-right p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center gap-3"
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
          </>
        )}
      </div>`;

const regex = /\{\/\* Sidebar \*\/\}\n\s*<div className=\{`fixed top-0 right-0 h-full w-80 bg-white[\s\S]*?<\/div>\n\s*<\/div>/;
code = code.replace(regex, sidebarCode);
fs.writeFileSync('src/App.tsx', code);
