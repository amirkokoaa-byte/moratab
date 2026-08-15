const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/تم الإصدار آلياً بواسطة نظام "مُرَتَّبَا" لإدارة الرواتب والأجور\./g, 'تم الإصدار بواسطة نظام "مرتبا" لإدارة الرواتب AmirLamay');

const pdfHeaderOld = `      <div style="text-align: center; border-bottom: 2px solid #1f497d; padding-bottom: 15px; margin-bottom: 25px;">
          <h1 style="color: #1f497d; font-size: 22px; font-weight: 800; margin: 0 0 5px 0;">تفاصيل الراتب</h1>
          <p style="color: #64748b; font-size: 13px; margin: 0;">\${selectedCycle} - كود الموظف: \${emp.code}</p>
      </div>`;

const pdfHeaderNew = `      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1f497d; padding-bottom: 15px; margin-bottom: 25px;">
          <div style="text-align: right;">
              <h1 style="color: #1f497d; font-size: 22px; font-weight: 800; margin: 0 0 5px 0;">تفاصيل الراتب</h1>
              <p style="color: #64748b; font-size: 13px; margin: 0;">\${selectedCycle} - كود الموظف: \${emp.code}</p>
          </div>
          \${logoImage ? \`<img src="\${logoImage}" style="max-height: 50px; max-width: 100px; object-fit: contain;" />\` : ''}
      </div>`;

// Replace both occurrences of the header
code = code.split(pdfHeaderOld).join(pdfHeaderNew);

fs.writeFileSync('src/App.tsx', code);
