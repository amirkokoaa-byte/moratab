const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { Upload, Download, FileText, FileSpreadsheet, MessageCircle, Menu, X, Clock, Settings, Save, Plus, ArrowRight } from 'lucide-react';",
  "import { Upload, Download, FileText, FileSpreadsheet, MessageCircle, Menu, X, Clock, Settings, Save, Plus, ArrowRight, Edit, Check } from 'lucide-react';"
);

const stateCode = `  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Employee | null>(null);`;
code = code.replace("  const [contacts, setContacts] = useState<Contact[]>([]);", stateCode);

const funcsCode = `  const handleEditClick = (idx: number, emp: Employee) => {
    setEditingIndex(idx);
    setEditFormData({ ...emp });
  };

  const handleEditChange = (field: keyof Employee, value: string) => {
    if (!editFormData) return;
    const numVal = parseFloat(value) || 0;
    const updated = { ...editFormData, [field]: field === 'name' || field === 'code' ? value : numVal };
    
    // Recalculate net if numeric field
    if (['basic', 'trans', 'bonus', 'overtime', 'advance', 'insur', 'tax', 'penalty', 'takaful'].includes(field)) {
      updated.net = updated.basic + updated.trans + updated.bonus + updated.overtime - updated.advance - updated.insur - updated.tax - updated.penalty - updated.takaful;
    }
    
    setEditFormData(updated);
  };

  const handleEditSave = (idx: number) => {
    if (!editFormData) return;
    const newData = [...employeesData];
    newData[idx] = editFormData;
    setEmployeesData(newData);
    saveCurrentData(newData, selectedCycle);
    setEditingIndex(null);
    setEditFormData(null);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditFormData(null);
  };

  const shareEmployeePdf`;

code = code.replace("  const shareEmployeePdf", funcsCode);

fs.writeFileSync('src/App.tsx', code);
