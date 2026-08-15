const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const logoUploadCode = `            <div className="p-4 overflow-y-auto h-[calc(100%-60px)] bg-slate-50">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
                  <h3 className="font-bold text-slate-700 text-sm w-full text-right">شعار الشركة (اللوجو)</h3>
                  <label className="cursor-pointer group relative flex flex-col items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 overflow-hidden transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    {logoImage ? (
                      <>
                        <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">تغيير الصورة</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-xs text-slate-500 font-medium">اختر صورة</span>
                      </>
                    )}
                  </label>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-bold text-slate-700 text-sm mb-3 text-right">أرقام الموظفين</h3>
                </div>
                {contacts.map((contact, idx) => (`;

code = code.replace(/            <div className="p-4 overflow-y-auto h-\[calc\(100\%-60px\)\] bg-slate-50">\n              <div className="space-y-4">\n                \{contacts\.map\(\(contact, idx\) => \(/, logoUploadCode);

code = code.replace(
  '<h2 className="font-bold text-lg text-slate-800">إعدادات الأرقام</h2>',
  '<h2 className="font-bold text-lg text-slate-800">الإعدادات</h2>'
);

fs.writeFileSync('src/App.tsx', code);
