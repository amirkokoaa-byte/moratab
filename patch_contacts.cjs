const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const interfaceStr = `
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
`;

code = code.replace('const columnAliases:', interfaceStr + '\nconst columnAliases:');
fs.writeFileSync('src/App.tsx', code);
