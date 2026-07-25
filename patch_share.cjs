const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const funcsStr = `
  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    const encrypted = btoa(encodeURIComponent(JSON.stringify(newContacts)));
    localStorage.setItem('morattaba_contacts', encrypted);
  };

  const handleSettingsClick = () => {
    const pwd = window.prompt('أدخل كلمة المرور:');
    if (pwd === '0000') {
      setIsSettingsOpen(true);
      setIsSidebarOpen(true);
    } else if (pwd !== null) {
      alert('كلمة المرور خاطئة');
    }
  };

  const shareEmployeePdf = async (emp: Employee) => {
    const contact = contacts.find(c => c.name.trim() === emp.name.trim());
    if (contact && contact.phone) {
      const pdfBlob = await generatePdfBlobForEmployee(emp);
      if (!pdfBlob) return;
      
      const file = new File([pdfBlob], \`Salary_\${emp.name}.pdf\`, { type: 'application/pdf' });
      
      // Auto-download file for WhatsApp attachment later
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`Salary_\${emp.name}.pdf\`;
      a.click();
      URL.revokeObjectURL(url);
      
      const text = encodeURIComponent(\`مرحباً \${emp.name}، مرفق قسيمة تفاصيل الراتب الخاصة بك.\`);
      const waLink = \`https://wa.me/\${contact.phone}?text=\${text}\`;
      window.open(waLink, '_blank');
      return;
    }
`;

code = code.replace('  const shareEmployeePdf = async (emp: Employee) => {', funcsStr);

fs.writeFileSync('src/App.tsx', code);
