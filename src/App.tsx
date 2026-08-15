import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import { Upload, Download, FileText, FileSpreadsheet, MessageCircle, Menu, X, Clock, Settings, Save, Plus, ArrowRight, Edit, Check, Trash2, ChevronDown, ChevronLeft } from 'lucide-react';

interface Employee {
  serial: number;
  selected: boolean;
  code: string;
  name: string;
  days: number;
  advance: number;
  basic: number;
  trans: number;
  bonus: number;
  overtime: number;
  insur: number;
  tax: number;
  penalty: number;
  takaful: number;
  net: number;
}


interface Contact {
  id: string;
  name: string;
  phone: string;
}

const predefinedNames = [
  "حسن محمد حسن احمد",
  "محمد عمر محمد كامل",
  "رندا سعيد سيد عبدالخالق",
  "حبيبه شوقى شاكر السيد",
  "بسمه محمد زكريا سالم",
  "محمد احمد عباس محمد",
  "اسماء صالح على محمد",
  "فارس عمرو السيد علي",
  "نجوى محمد صديق فهمي",
  "امنيه اشرف سيد محمد",
  "ملك هيثم حلمي عبد المعطي",
  "تقى محمد عبدالحميد مصطفى",
  "احمد عوض الله جمال عوض الله",
  "سعيد محمد عادل حلمي",
  "منه احمد محمد حسن عبود"
];

const columnAliases: Record<string, string[]> = {
  code: ['كود الموظف', 'الكود الجديد', 'الكود الوظيفي', 'Code', 'ID'],
  name: ['اسم الموظف', 'إسم الموظف', 'الاسم', 'Name'],
  days: ['ايام الحضور', 'أيام الحضور', 'Days'],
  advance: ['سلفة', 'سلفه', 'سلف', 'Advance', 'Loans'],
  basic: ['اجمال الراتب الاساسي', 'اجمالى الراتب الاساسى', 'المرتب الأساسي ', 'Basic'],
  trans: ['بدل الانتقال', 'بدل انتقالات', 'بدل سفر', 'Trans'],
  bonus: ['حوافز', 'حوافز ', 'Incentives'],
  overtime: ['اضافي قيمه', 'اضافى قيمه', 'Overtime'],
  insur: ['تأمينات اجتماعيه', 'تامينات اجتماعية', 'Insurance'],
  tax: ['الضريبه', 'الضريبة ', 'Tax'],
  penalty: ['قيمة الجزاء', 'جزاءات', 'جزاء', 'Penalty', 'Penalties'],
  takaful: ['صندوق التكافل', 'صندوق التكافل الاجتماعى', 'Takaful'],
  net: ['الصافي النهائي', 'الصافى النهائى', 'صافى المرتب', 'Net']
};

function getVal(row: any, aliasKey: string): any {
  for (const alias of columnAliases[aliasKey]) {
    if (row[alias] !== undefined && row[alias] !== null && String(row[alias]).trim() !== '') {
      return row[alias];
    }
  }
  return aliasKey === 'name' || aliasKey === 'code' ? '---' : 0;
}

function num(v: any): number {
  const n = parseFloat(String(v).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

function generateCycleOptions() {
  const options = [];
  const today = new Date();
  for (let i = -6; i <= 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const prevM = new Date(today.getFullYear(), today.getMonth() + i - 1, 1);
    const val = `من 21 ${prevM.toLocaleDateString('ar-EG', { month: 'long' })} إلى 20 ${d.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}`;
    options.push({ value: val, label: val });
  }
  return options;
}

const cycleOptions = generateCycleOptions();

export default function App() {
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(cycleOptions[6].value);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({ [new Date().getFullYear().toString()]: true });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Employee | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [savedMonths, setSavedMonths] = useState<Record<string, Employee[]>>({});
  const pdfRenderContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('morattaba_saved_months') || '{}');
    setSavedMonths(saved);
    
    const savedLogo = localStorage.getItem('morattaba_logo');
    if (savedLogo) {
      setLogoImage(savedLogo);
    }

    
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
  }, []);

  const saveCurrentData = (data: Employee[], cycle: string) => {
    if (data.length === 0) return;
    const saved = JSON.parse(localStorage.getItem('morattaba_saved_months') || '{}');
    saved[cycle] = data;
    localStorage.setItem('morattaba_saved_months', JSON.stringify(saved));
    setSavedMonths(saved);
  };

  const deleteCycle = (cycle: string) => {
    if (window.confirm(`هل أنت متأكد من حذف بيانات "${cycle}"؟`)) {
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

  const loadMonth = (cycle: string) => {
    const data = savedMonths[cycle];
    if (data) {
      setEmployeesData(data);
      setSelectedCycle(cycle);
      setAllSelected(data.every(e => e.selected) && data.length > 0);
      setIsSidebarOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json(worksheet);

      const parsedData: Employee[] = rawJson.map((row: any, index) => ({
        serial: index + 1,
        selected: false,
        code: getVal(row, 'code'),
        name: getVal(row, 'name'),
        days: num(getVal(row, 'days')),
        advance: num(getVal(row, 'advance')),
        basic: num(getVal(row, 'basic')),
        trans: num(getVal(row, 'trans')),
        bonus: num(getVal(row, 'bonus')),
        overtime: num(getVal(row, 'overtime')),
        insur: num(getVal(row, 'insur')),
        tax: num(getVal(row, 'tax')),
        penalty: num(getVal(row, 'penalty')),
        takaful: num(getVal(row, 'takaful')),
        net: num(getVal(row, 'net'))
      }));

      setEmployeesData(parsedData);
      setAllSelected(false);
      saveCurrentData(parsedData, selectedCycle);
    };
    reader.readAsArrayBuffer(file);
    // Reset file input so same file can be uploaded again if needed
    e.target.value = '';
  };

  const toggleSelect = (index: number) => {
    const newData = [...employeesData];
    newData[index].selected = !newData[index].selected;
    setEmployeesData(newData);
    setAllSelected(newData.every(e => e.selected) && newData.length > 0);
  };

  const toggleSelectAll = () => {
    const newSelected = !allSelected;
    setAllSelected(newSelected);
    setEmployeesData(employeesData.map(emp => ({ ...emp, selected: newSelected })));
  };

  const selectedCount = employeesData.filter(e => e.selected).length;
  const totalCount = employeesData.length;
  const hasSelected = selectedCount > 0;

  const exportExcel = () => {
    const selected = employeesData.filter(e => e.selected);
    if (!selected.length) return;

    const wb = XLSX.utils.book_new();
    const verticalRows: any[] = [];

    selected.forEach(emp => {
      verticalRows.push({ 'البيان': '=== قسيمة راتب موظف ===', 'القيمة': `${emp.name} (كود: ${emp.code})` });
      verticalRows.push({ 'البيان': 'الكود الوظيفي', 'القيمة': emp.code });
      verticalRows.push({ 'البيان': 'اسم الموظف', 'القيمة': emp.name });
      verticalRows.push({ 'البيان': 'ايام الحضور', 'القيمة': emp.days });
      verticalRows.push({ 'البيان': 'سلفه', 'القيمة': emp.advance });
      verticalRows.push({ 'البيان': 'اجمال الراتب الاساسي', 'القيمة': emp.basic });
      verticalRows.push({ 'البيان': 'بدل الانتقال', 'القيمة': emp.trans });
      verticalRows.push({ 'البيان': 'حوافز', 'القيمة': emp.bonus });
      verticalRows.push({ 'البيان': 'اضافي قيمه', 'القيمة': emp.overtime });
      verticalRows.push({ 'البيان': 'تأمينات اجتماعيه', 'القيمة': emp.insur });
      verticalRows.push({ 'البيان': 'الضريبه', 'القيمة': emp.tax });
      verticalRows.push({ 'البيان': 'قيمة الجزاء', 'القيمة': emp.penalty });
      verticalRows.push({ 'البيان': 'صندوق التكافل', 'القيمة': emp.takaful });
      verticalRows.push({ 'البيان': 'الصافي النهائي', 'القيمة': emp.net });
      verticalRows.push({ 'البيان': '', 'القيمة': '' });
    });

    const ws = XLSX.utils.json_to_sheet(verticalRows);
    ws['!cols'] = [{ wch: 25 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws, "Employee_Salary_Slips");
    XLSX.writeFile(wb, "Employee_Salary_Slips_v2_Selected.xlsx");
  };

  const exportPdf = () => {
    const selected = employeesData.filter(e => e.selected);
    if (!selected.length || !pdfRenderContainerRef.current) return;

    const container = pdfRenderContainerRef.current;
    container.innerHTML = '';
    container.classList.remove('hidden');

    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = "'Tajawal', sans-serif";
    wrapper.style.direction = "rtl";
    wrapper.style.color = "#1e293b";

    selected.forEach((emp, idx) => {
      const slip = document.createElement('div');
      slip.style.padding = "30px";
      slip.style.backgroundColor = "#ffffff";
      slip.style.border = "2px solid #1f497d";
      slip.style.borderRadius = "12px";
      slip.style.marginBottom = "30px";
      if (idx < selected.length - 1) {
        slip.style.pageBreakAfter = "always";
      }

      slip.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #1f497d; padding-bottom: 15px; margin-bottom: 25px;">
            <h1 style="color: #1f497d; font-size: 22px; font-weight: 800; margin: 0 0 5px 0;">تفاصيل الراتب</h1>
            <p style="color: #64748b; font-size: 13px; margin: 0;">${selectedCycle} - كود الموظف: ${emp.code}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; width: 45%; color: #475569;">اسم الموظف</th><td style="padding: 10px; font-weight: bold; color: #0f172a;">${emp.name}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">الكود الوظيفي</th><td style="padding: 10px;">${emp.code}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">أيام الحضور</th><td style="padding: 10px;">${emp.days} يوم</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">سلفة</th><td style="padding: 10px; color: #e11d48;">${emp.advance.toLocaleString('en-US')}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">إجمال الراتب الأساسي</th><td style="padding: 10px;">${emp.basic.toLocaleString('en-US', {minimumFractionDigits: 2})}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">بدل الانتقال</th><td style="padding: 10px;">${emp.trans.toLocaleString('en-US')}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">حوافز</th><td style="padding: 10px; color: #059669;">${emp.bonus.toLocaleString('en-US')}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">إضافي قيمة</th><td style="padding: 10px;">${emp.overtime.toLocaleString('en-US', {minimumFractionDigits: 2})}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">تأمينات اجتماعية</th><td style="padding: 10px;">${emp.insur.toLocaleString('en-US')}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">الضريبة</th><td style="padding: 10px; color: #e11d48;">${emp.tax.toLocaleString('en-US', {minimumFractionDigits: 2})}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">قيمة الجزاء</th><td style="padding: 10px; color: #e11d48;">${emp.penalty.toLocaleString('en-US', {minimumFractionDigits: 2})}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">صندوق التكافل</th><td style="padding: 10px;">${emp.takaful.toLocaleString('en-US')}</td></tr>
                <tr style="background: #eff6ff; border-top: 2px solid #1f497d; border-bottom: 2px solid #1f497d;">
                    <th style="padding: 14px 10px; color: #1e3a8a; font-size: 17px;">الصافي النهائي</th>
                    <td style="padding: 14px 10px; font-weight: 900; color: #1e3a8a; font-size: 18px;">${emp.net.toLocaleString('en-US', {minimumFractionDigits: 2})} جنيه</td>
                </tr>
            </tbody>
        </table>
        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
            تم الإصدار بواسطة نظام "مرتبا" لإدارة الرواتب AmirLamay
        </div>
      `;
      wrapper.appendChild(slip);
    });

    container.appendChild(wrapper);

    const opt = {
      margin: 15,
      filename: 'Employee_Salary_Slips_v2_Selected.pdf',
      image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' }
    };

    html2pdf().set(opt).from(wrapper).save().then(() => {
      container.classList.add('hidden');
      container.innerHTML = '';
    });
  };

  const generatePdfBlobForEmployee = async (emp: Employee): Promise<Blob | null> => {
    if (!pdfRenderContainerRef.current) return null;

    const container = pdfRenderContainerRef.current;
    container.innerHTML = '';
    container.classList.remove('hidden');

    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = "'Tajawal', sans-serif";
    wrapper.style.direction = "rtl";
    wrapper.style.color = "#1e293b";

    const slip = document.createElement('div');
    slip.style.padding = "30px";
    slip.style.backgroundColor = "#ffffff";
    slip.style.border = "2px solid #1f497d";
    slip.style.borderRadius = "12px";
    
    slip.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1f497d; padding-bottom: 15px; margin-bottom: 25px;">
          <div style="text-align: right;">
              <h1 style="color: #1f497d; font-size: 22px; font-weight: 800; margin: 0 0 5px 0;">تفاصيل الراتب</h1>
              <p style="color: #64748b; font-size: 13px; margin: 0;">${selectedCycle} - كود الموظف: ${emp.code}</p>
          </div>
          ${logoImage ? `<img src="${logoImage}" style="max-height: 50px; max-width: 100px; object-fit: contain;" />` : ''}
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; width: 45%; color: #475569;">اسم الموظف</th><td style="padding: 10px; font-weight: bold; color: #0f172a;">${emp.name}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">الكود الوظيفي</th><td style="padding: 10px;">${emp.code}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">أيام الحضور</th><td style="padding: 10px;">${emp.days} يوم</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">سلفة</th><td style="padding: 10px; color: #e11d48;">${emp.advance.toLocaleString('en-US')}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">إجمال الراتب الأساسي</th><td style="padding: 10px;">${emp.basic.toLocaleString('en-US', {minimumFractionDigits: 2})}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">بدل الانتقال</th><td style="padding: 10px;">${emp.trans.toLocaleString('en-US')}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">حوافز</th><td style="padding: 10px; color: #059669;">${emp.bonus.toLocaleString('en-US')}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">إضافي قيمة</th><td style="padding: 10px;">${emp.overtime.toLocaleString('en-US', {minimumFractionDigits: 2})}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">تأمينات اجتماعية</th><td style="padding: 10px;">${emp.insur.toLocaleString('en-US')}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">الضريبة</th><td style="padding: 10px; color: #e11d48;">${emp.tax.toLocaleString('en-US', {minimumFractionDigits: 2})}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">قيمة الجزاء</th><td style="padding: 10px; color: #e11d48;">${emp.penalty.toLocaleString('en-US', {minimumFractionDigits: 2})}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><th style="padding: 10px; background: #f8fafc; text-align: right; color: #475569;">صندوق التكافل</th><td style="padding: 10px;">${emp.takaful.toLocaleString('en-US')}</td></tr>
              <tr style="background: #eff6ff; border-top: 2px solid #1f497d; border-bottom: 2px solid #1f497d;">
                  <th style="padding: 14px 10px; color: #1e3a8a; font-size: 17px;">الصافي النهائي</th>
                  <td style="padding: 14px 10px; font-weight: 900; color: #1e3a8a; font-size: 18px;">${emp.net.toLocaleString('en-US', {minimumFractionDigits: 2})} جنيه</td>
              </tr>
          </tbody>
      </table>
      <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
          تم الإصدار بواسطة نظام "مرتبا" لإدارة الرواتب AmirLamay
      </div>
    `;
    wrapper.appendChild(slip);
    container.appendChild(wrapper);

    const opt = {
      margin: 15,
      filename: `Salary_${emp.name}.pdf`,
      image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' }
    };

    try {
      const pdfBlob = await html2pdf().set(opt).from(wrapper).output('blob');
      container.classList.add('hidden');
      container.innerHTML = '';
      return pdfBlob;
    } catch (error) {
      console.error(error);
      container.classList.add('hidden');
      container.innerHTML = '';
      return null;
    }
  };


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

  const handleDeleteSelected = () => {
    if (window.confirm('هل تريد بالتأكيد حذف السجلات المحددة؟ (نعم للحذف، لا للإلغاء)')) {
      const remaining = employeesData.filter(emp => !emp.selected).map((emp, i) => ({ ...emp, serial: i + 1 }));
      setEmployeesData(remaining);
      saveCurrentData(remaining, selectedCycle);
      setAllSelected(false);
    }
  };

  const handleEditClick = (idx: number, emp: Employee) => {
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

  const shareEmployeePdf = async (emp: Employee) => {
    const contact = contacts.find(c => c.name.trim() === emp.name.trim());
    if (contact && contact.phone) {
      const pdfBlob = await generatePdfBlobForEmployee(emp);
      if (!pdfBlob) return;
      
      const file = new File([pdfBlob], `Salary_${emp.name}.pdf`, { type: 'application/pdf' });
      
      // Auto-download file for WhatsApp attachment later
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Salary_${emp.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      const text = encodeURIComponent(`مرحباً ${emp.name}، مرفق قسيمة تفاصيل الراتب الخاصة بك.`);
      const waLink = `https://wa.me/${contact.phone}?text=${text}`;
      window.open(waLink, '_blank');
      return;
    }

    const pdfBlob = await generatePdfBlobForEmployee(emp);
    if (!pdfBlob) return;

    const file = new File([pdfBlob], `Salary_${emp.name}.pdf`, { type: 'application/pdf' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `تفاصيل الراتب - ${emp.name}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Just download the file
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Salary_${emp.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCycleChange = (newCycle: string) => {
    setSelectedCycle(newCycle);
    if (employeesData.length > 0) {
      saveCurrentData(employeesData, newCycle);
    }
  };

  const totalNet = employeesData.reduce((sum, emp) => sum + emp.net, 0);

  return (
    <div className="flex flex-col min-h-screen md:h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-x-hidden" dir="rtl">
      {/* Header */}
      <header className="bg-indigo-950 text-white px-6 py-4 flex justify-between items-center shrink-0 border-b-4 border-indigo-500">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-indigo-800 rounded-lg transition-colors shrink-0">
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-2xl font-black shrink-0">M</div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold leading-tight">مُرَتَّبَا | <span className="text-indigo-300 font-medium">Morattaba</span></h1>
            <p className="text-xs text-indigo-200 opacity-80">نظام إدارة وتصدير قسائم رواتب الموظفين v2.4</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-medium">المتصفح: متصل</span>
          </div>
          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
             <Upload className="w-4 h-4" />
             <span className="hidden sm:inline">استيراد ملف Excel</span>
             <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-50 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {isSettingsOpen ? (
          <>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="font-bold text-lg text-slate-800">الإعدادات</h2>
              </div>
              <button onClick={() => { setIsSettingsOpen(false); setIsSidebarOpen(false); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)] bg-slate-50">
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
                <div className="space-y-4">
                  {Object.entries(
                    Object.keys(savedMonths).reduce((acc: Record<string, string[]>, cycle) => {
                      const match = cycle.match(/\d{4}$/);
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
                            <div key={cycle} className="relative group w-full flex rounded-lg border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50 transition-colors overflow-hidden">
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
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>


      {/* Main Content Area */}
      <div className="flex-1 mx-2 sm:mx-4 mb-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[500px] md:min-h-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b bg-slate-50 gap-3">
          <div className="flex flex-wrap items-center gap-4">
             <h2 className="font-bold text-slate-700">سجل البيانات الحالية</h2>
             {employeesData.length > 0 && (
                <button
                   onClick={toggleSelectAll}
                   className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                 >
                   {allSelected ? 'إلغاء تحديد الكل' : 'تحديد جميع اللاينات'}
                 </button>
             )}
             {hasSelected && (
                <button
                   onClick={handleDeleteSelected}
                   className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
                 >
                   <Trash2 className="w-4 h-4" /> حذف المحددة
                 </button>
             )}
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCycle}
              onChange={(e) => handleCycleChange(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 flex-1 sm:flex-none"
            >
              {cycleOptions.map((opt, i) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={exportExcel}
                disabled={!hasSelected}
                className="flex-1 sm:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors disabled:cursor-not-allowed flex items-center gap-1"
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" /> تصدير Excel
              </button>
              <button
                onClick={exportPdf}
                disabled={!hasSelected}
                className="flex-1 sm:flex-none justify-center bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors disabled:cursor-not-allowed flex items-center gap-1"
              >
                <FileText className="w-4 h-4 shrink-0" /> تصدير PDF
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto relative">
           {employeesData.length > 0 ? (
              <table className="w-full min-w-[900px] text-xs text-right border-collapse">
                  <thead className="bg-slate-900 text-white sticky top-0 z-10 whitespace-nowrap">
                    <tr>
                      <th className="p-3 border-l border-slate-700 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                          className="accent-indigo-500 w-3 h-3 cursor-pointer"
                        />
                      </th>
                      <th className="p-3 border-l border-slate-700 text-center w-10">م</th>
                      <th className="p-3 border-l border-slate-700">كود الموظف</th>
                      <th className="p-3 border-l border-slate-700">اسم الموظف</th>
                      <th className="p-3 border-l border-slate-700 text-center">الحضور</th>
                      <th className="p-3 border-l border-slate-700 text-center">سلفة</th>
                      <th className="p-3 border-l border-slate-700 text-center">الأساسي</th>
                      <th className="p-3 border-l border-slate-700 text-center">بدل انتقالات</th>
                      <th className="p-3 border-l border-slate-700 text-center">الحوافز</th>
                      <th className="p-3 border-l border-slate-700 text-center">إضافي قيمة</th>
                      <th className="p-3 border-l border-slate-700 text-center">تأمينات</th>
                      <th className="p-3 border-l border-slate-700 text-center">ضرائب</th>
                      <th className="p-3 border-l border-slate-700 text-center">جزاءات</th>
                      <th className="p-3 border-l border-slate-700 text-center">تكافل</th>
                      <th className="p-3 bg-indigo-600 text-center font-bold">الصافي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                                        {employeesData.map((emp, idx) => (
                      editingIndex === idx && editFormData ? (
                        <tr key={idx} className="bg-indigo-50 transition-colors">
                          <td className="p-2 text-center">
                             <button onClick={() => handleEditSave(idx)} className="text-emerald-600 bg-emerald-100 p-1.5 rounded-full hover:bg-emerald-200">
                               <Check className="w-4 h-4" />
                             </button>
                             <button onClick={handleEditCancel} className="text-rose-600 bg-rose-100 p-1.5 rounded-full hover:bg-rose-200 mt-1">
                               <X className="w-4 h-4" />
                             </button>
                          </td>
                          <td className="p-2 text-center text-slate-500">{emp.serial}</td>
                          <td className="p-2 font-mono font-bold text-indigo-700">{emp.code}</td>
                          <td className="p-2 font-bold">{emp.name}</td>
                          <td className="p-2"><input type="number" value={editFormData.days} onChange={e => handleEditChange('days', e.target.value)} className="w-16 border rounded px-1 py-1 text-center text-xs" /></td>
                          <td className="p-2"><input type="number" value={editFormData.advance} onChange={e => handleEditChange('advance', e.target.value)} className="w-20 border rounded px-1 py-1 text-center text-xs text-rose-600" /></td>
                          <td className="p-2"><input type="number" value={editFormData.basic} onChange={e => handleEditChange('basic', e.target.value)} className="w-20 border rounded px-1 py-1 text-center text-xs" /></td>
                          <td className="p-2"><input type="number" value={editFormData.trans} onChange={e => handleEditChange('trans', e.target.value)} className="w-16 border rounded px-1 py-1 text-center text-xs" /></td>
                          <td className="p-2"><input type="number" value={editFormData.bonus} onChange={e => handleEditChange('bonus', e.target.value)} className="w-16 border rounded px-1 py-1 text-center text-xs text-emerald-600" /></td>
                          <td className="p-2"><input type="number" value={editFormData.overtime} onChange={e => handleEditChange('overtime', e.target.value)} className="w-16 border rounded px-1 py-1 text-center text-xs" /></td>
                          <td className="p-2"><input type="number" value={editFormData.insur} onChange={e => handleEditChange('insur', e.target.value)} className="w-16 border rounded px-1 py-1 text-center text-xs" /></td>
                          <td className="p-2"><input type="number" value={editFormData.tax} onChange={e => handleEditChange('tax', e.target.value)} className="w-16 border rounded px-1 py-1 text-center text-xs text-rose-600" /></td>
                          <td className="p-2"><input type="number" value={editFormData.penalty} onChange={e => handleEditChange('penalty', e.target.value)} className="w-16 border rounded px-1 py-1 text-center text-xs text-rose-600" /></td>
                          <td className="p-2"><input type="number" value={editFormData.takaful} onChange={e => handleEditChange('takaful', e.target.value)} className="w-16 border rounded px-1 py-1 text-center text-xs" /></td>
                          <td className="p-2 text-center font-black bg-indigo-100 text-indigo-900">{editFormData.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ) : (
                      <tr
                        key={idx}
                        className={`${idx % 2 === 0 ? 'bg-indigo-50/50' : 'bg-white'} hover:bg-indigo-100/50 transition-colors cursor-pointer`}
                        onClick={() => toggleSelect(idx)}
                      >
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={emp.selected}
                            onChange={() => toggleSelect(idx)}
                            className="accent-indigo-500 w-3 h-3 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 text-center text-slate-500">{emp.serial}</td>
                        <td className="p-3 font-mono font-bold text-indigo-700">{emp.code}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-start gap-2">
                            <span className="font-bold whitespace-nowrap">{emp.name}</span>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); shareEmployeePdf(emp); }}
                                className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-full transition-colors"
                                title="مشاركة عبر واتساب"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEditClick(idx, emp); }}
                                className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-full transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">{emp.days}</td>
                        <td className="p-3 text-center text-rose-600">{emp.advance ? emp.advance.toLocaleString('en-US') : '0'}</td>
                        <td className="p-3 text-center">{emp.basic.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-center">{emp.trans.toLocaleString('en-US')}</td>
                        <td className="p-3 text-center text-emerald-600">{emp.bonus.toLocaleString('en-US')}</td>
                        <td className="p-3 text-center">{emp.overtime.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-center">{emp.insur.toLocaleString('en-US')}</td>
                        <td className="p-3 text-center text-rose-600">{emp.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-center text-rose-600">{emp.penalty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-center">{emp.takaful.toLocaleString('en-US')}</td>
                        <td className="p-3 text-center font-black bg-indigo-50 text-indigo-900">{emp.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      </tr>
                      )
                    ))}
                  </tbody>
              </table>
           ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 pt-12">
                 <FileSpreadsheet className="w-12 h-12 text-slate-300" />
                 <p className="text-sm">قم برفع ملف Excel لعرض البيانات هنا</p>
              </div>
           )}
        </div>
      </div>
      
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4 shrink-0">
        <div className="bg-white p-2 sm:p-3 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <p className="text-slate-500 text-xs mb-1 font-bold uppercase tracking-wider">إجمالي الموظفين</p>
          <p className="text-2xl font-black text-slate-900">{totalCount}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-sm ring-2 ring-indigo-500/10">
          <p className="text-indigo-600 text-xs mb-1 font-bold uppercase tracking-wider">تم تحديدهم للتصدير</p>
          <p className="text-2xl font-black text-indigo-700">{selectedCount}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs mb-1 font-bold uppercase tracking-wider">إجمالي الصافي</p>
          <p className="text-2xl font-black text-slate-900 text-left tracking-tighter">
            {totalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-normal">ج.م</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 px-6 py-2 flex justify-between items-center shrink-0 text-[10px]">
         <div>&copy; {new Date().getFullYear()} مُرَتَّبَا - جميع الحقوق محفوظة</div>
         <div className="flex gap-4">
            <span>تواصل مع الدعم الفني</span>
            <span>دليل المستخدم</span>
            <span className="text-indigo-400 font-bold uppercase tracking-widest">SECURE-v2</span>
         </div>
      </footer>

      {/* Hidden PDF Container */}
      <div ref={pdfRenderContainerRef} className="hidden"></div>
    </div>
  );
}

