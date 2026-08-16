const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "import { Upload",
  "import ReactCrop, { type Crop } from 'react-image-crop';\nimport 'react-image-crop/dist/ReactCrop.css';\nimport { Upload"
);

// 2. Add state and ref
const stateCode = `  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [pendingLogo, setPendingLogo] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);`;
code = code.replace(/  const \[logoImage, setLogoImage\] = useState<string \| null>\(null\);\n  const \[pendingLogo, setPendingLogo\] = useState<string \| null>\(null\);/, stateCode);

// 3. Modify handleLogoUpload
const uploadCode = `  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      setCropImageSrc(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCrop = () => {
    if (!completedCrop || !imgRef.current) return;
    
    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    
    const base64Image = canvas.toDataURL('image/png');
    setPendingLogo(base64Image);
    setCropImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(null);
  };`;

code = code.replace(/  const handleLogoUpload = \([\s\S]*?reader\.readAsDataURL\(file\);\n  \};/, uploadCode);


// 4. Add the modal at the very end just before the final </div>
const modalCode = `      {/* Hidden PDF Container */}
      <div ref={pdfRenderContainerRef} className="hidden"></div>

      {cropImageSrc && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 max-w-lg w-full flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 text-lg text-right">قص الشعار</h3>
            <div className="overflow-auto max-h-[60vh] flex justify-center bg-slate-50 border border-slate-200 rounded">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={cropImageSrc}
                  alt="Crop me"
                  className="max-w-full"
                  onLoad={(e) => {
                     setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
                  }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setCropImageSrc(null); setCrop(undefined); setCompletedCrop(null); }}
                className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmCrop}
                className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded font-bold flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> تأكيد القص
              </button>
            </div>
          </div>
        </div>
      )}`;

code = code.replace(/      \{\/\* Hidden PDF Container \*\/\}\n      <div ref=\{pdfRenderContainerRef\} className="hidden"><\/div>/, modalCode);

fs.writeFileSync('src/App.tsx', code);
