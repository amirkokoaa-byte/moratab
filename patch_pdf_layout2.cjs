const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeader1 = `        <div style="position: relative; text-align: center; border-bottom: 2px solid #1f497d; padding-bottom: 15px; margin-bottom: 25px; min-height: 60px;">
            <h1 style="color: #1f497d; font-size: 22px; font-weight: 800; margin: 0 0 5px 0;">تفاصيل الراتب</h1>
            <p style="color: #64748b; font-size: 13px; margin: 0;">\${selectedCycle} - كود الموظف: \${emp.code}</p>
            \${logoImage ? \`<img src="\${logoImage}" style="position: absolute; left: 0; top: 0; max-height: 60px; max-width: 120px; object-fit: contain;" />\` : ''}
        </div>`;

const oldHeader2 = `      <div style="position: relative; text-align: center; border-bottom: 2px solid #1f497d; padding-bottom: 15px; margin-bottom: 25px; min-height: 60px;">
          <h1 style="color: #1f497d; font-size: 22px; font-weight: 800; margin: 0 0 5px 0;">تفاصيل الراتب</h1>
          <p style="color: #64748b; font-size: 13px; margin: 0;">\${selectedCycle} - كود الموظف: \${emp.code}</p>
          \${logoImage ? \`<img src="\${logoImage}" style="position: absolute; left: 0; top: 0; max-height: 60px; max-width: 120px; object-fit: contain;" />\` : ''}
      </div>`;

const newHeader1 = `        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; border-bottom: 2px solid #1f497d; padding-bottom: 15px; margin-bottom: 25px;">
            <div style="text-align: right;">
                <h1 style="color: #1f497d; font-size: 22px; font-weight: 800; margin: 0 0 5px 0;">تفاصيل الراتب</h1>
                <p style="color: #64748b; font-size: 13px; margin: 0;">\${selectedCycle} - كود الموظف: \${emp.code}</p>
            </div>
            \${logoImage ? \`<img src="\${logoImage}" style="max-height: 60px; max-width: 120px; object-fit: contain;" />\` : ''}
        </div>`;

const newHeader2 = `      <div style="display: flex; justify-content: center; align-items: center; gap: 20px; border-bottom: 2px solid #1f497d; padding-bottom: 15px; margin-bottom: 25px;">
          <div style="text-align: right;">
              <h1 style="color: #1f497d; font-size: 22px; font-weight: 800; margin: 0 0 5px 0;">تفاصيل الراتب</h1>
              <p style="color: #64748b; font-size: 13px; margin: 0;">\${selectedCycle} - كود الموظف: \${emp.code}</p>
          </div>
          \${logoImage ? \`<img src="\${logoImage}" style="max-height: 60px; max-width: 120px; object-fit: contain;" />\` : ''}
      </div>`;

code = code.replace(oldHeader1, newHeader1);
code = code.replace(oldHeader2, newHeader2);

fs.writeFileSync('src/App.tsx', code);
