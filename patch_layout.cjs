const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const kpiRegex = /      \{\/\* KPI Grid \*\/\}\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 shrink-0">[\s\S]*?<\/div>\n      <\/div>\n/;
const match = code.match(kpiRegex);
if (match) {
  code = code.replace(match[0], '');
  code = code.replace(/      \{\/\* Footer \*\/\}/, match[0] + '\n      {/* Footer */}');
  fs.writeFileSync('src/App.tsx', code);
  console.log("Moved KPI Grid");
} else {
  console.log("Could not find KPI Grid");
}
