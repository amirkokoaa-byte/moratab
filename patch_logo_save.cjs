const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add pendingLogo state
code = code.replace(
  "const [logoImage, setLogoImage] = useState<string | null>(null);",
  "const [logoImage, setLogoImage] = useState<string | null>(null);\n  const [pendingLogo, setPendingLogo] = useState<string | null>(null);"
);

// 2. Modify handleLogoUpload and add handleSaveLogo
const newFuncs = `  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      setPendingLogo(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = () => {
    if (pendingLogo) {
      setLogoImage(pendingLogo);
      localStorage.setItem('morattaba_logo', pendingLogo);
      setPendingLogo(null);
    }
  };`;

code = code.replace(/  const handleLogoUpload = \([\s\S]*?reader\.readAsDataURL\(file\);\n  \};/, newFuncs);

// 3. Update the UI block
const oldUI = `                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
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
                </div>`;

const newUI = `                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
                  <h3 className="font-bold text-slate-700 text-sm w-full text-right">شعار الشركة (اللوجو)</h3>
                  <label className="cursor-pointer group relative flex flex-col items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 overflow-hidden transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    {pendingLogo || logoImage ? (
                      <>
                        <img src={(pendingLogo || logoImage) as string} alt="Logo" className="w-full h-full object-contain" />
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
                  {pendingLogo && (
                    <button
                      onClick={handleSaveLogo}
                      className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" /> حفظ الصورة
                    </button>
                  )}
                </div>`;

code = code.replace(oldUI, newUI);

fs.writeFileSync('src/App.tsx', code);
