const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateStr = `  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);`;

code = code.replace('  const [isSidebarOpen, setIsSidebarOpen] = useState(false);', stateStr);

const effectStr = `  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('morattaba_saved_months') || '{}');
    setSavedMonths(saved);
    
    try {
      const encryptedContacts = localStorage.getItem('morattaba_contacts');
      if (encryptedContacts) {
        setContacts(JSON.parse(decodeURIComponent(atob(encryptedContacts))));
      } else {
        setContacts(predefinedNames.map((name, i) => ({ id: String(i), name, phone: '' })));
      }
    } catch (e) {
      setContacts(predefinedNames.map((name, i) => ({ id: String(i), name, phone: '' })));
    }
  }, []);`;

code = code.replace(/  React\.useEffect\(\(\) => \{\n    const saved = JSON\.parse\(localStorage\.getItem\('morattaba_saved_months'\) \|\| '\{\}'\);\n    setSavedMonths\(saved\);\n  \}, \[\]\);/g, effectStr);

fs.writeFileSync('src/App.tsx', code);
