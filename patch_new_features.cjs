const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state for logoImage
code = code.replace(
  "const [editFormData, setEditFormData] = useState<Employee | null>(null);",
  "const [editFormData, setEditFormData] = useState<Employee | null>(null);\n  const [logoImage, setLogoImage] = useState<string | null>(null);"
);

// 2. Add logoImage to useEffect
const useEffectStr = `  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('morattaba_saved_months') || '{}');
    setSavedMonths(saved);
    
    const savedLogo = localStorage.getItem('morattaba_logo');
    if (savedLogo) {
      setLogoImage(savedLogo);
    }
`;
code = code.replace(/  React\.useEffect\(\(\) => \{\n    const saved = JSON\.parse\(localStorage\.getItem\('morattaba_saved_months'\) \|\| '\{\}'\);\n    setSavedMonths\(saved\);/, useEffectStr);

// 3. Add deleteCycle and handleLogoUpload functions
const newFuncs = `  const deleteCycle = (cycle: string) => {
    if (window.confirm(\`هل أنت متأكد من حذف بيانات "\${cycle}"؟\`)) {
      const saved = { ...savedMonths };
      delete saved[cycle];
      localStorage.setItem('morattaba_saved_months', JSON.stringify(saved));
      setSavedMonths(saved);
      if (selectedCycle === cycle) {
        setEmployeesData([]);
      }
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      setLogoImage(base64);
      localStorage.setItem('morattaba_logo', base64);
    };
    reader.readAsDataURL(file);
  };

  const loadMonth = `;

code = code.replace("  const loadMonth = ", newFuncs);

fs.writeFileSync('src/App.tsx', code);
