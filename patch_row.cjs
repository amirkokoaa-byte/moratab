const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const rowRender = `                    {employeesData.map((emp, idx) => (
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
                        className={\`\${idx % 2 === 0 ? 'bg-indigo-50/50' : 'bg-white'} hover:bg-indigo-100/50 transition-colors cursor-pointer\`}
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
                  </tbody>`;

const regex = /\{employeesData\.map\(\(emp, idx\) => \([\s\S]*?<\/tr>\n\s*\)\)\}\n\s*<\/tbody>/;
code = code.replace(regex, rowRender);

fs.writeFileSync('src/App.tsx', code);
