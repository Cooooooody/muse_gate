
import React, { useState } from 'react';
import { Shield, FileText, Receipt, CheckCircle, Plus, Info, ChevronRight, Search } from 'lucide-react';
import { Subject, Contract, Invoice } from '../../types';

const ClientPortal: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '上海未来创意设计有限公司', taxId: '91310115MA1H7XU48M', source: 'CONTRACT_HISTORY' }
  ]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [view, setView] = useState<'overview' | 'subjects' | 'invoices'>('overview');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">欢迎回来，MuseGate 用户</h1>
          <p className="text-slate-500">管理您的合同主体、查看消费记录及开具发票</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setView('subjects')}
            className="flex items-center space-x-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold transition"
          >
            <Shield size={18} className="text-blue-600" />
            <span>管理主体</span>
          </button>
          <button 
            onClick={() => setView('invoices')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-lg shadow-blue-100"
          >
            <Receipt size={18} />
            <span>申请开票</span>
          </button>
        </div>
      </div>

      {view === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">最近合同</h3>
                <button className="text-sm text-blue-600 hover:underline">查看全部</button>
              </div>
              <div className="p-0">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition border-b last:border-0 border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <FileText size={24} className="text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">MuseGate 服务订购合同 (Q{i})</div>
                        <div className="text-sm text-slate-500">上海未来创意设计有限公司 · ￥{i * 10000}.00</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">已执行</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">消费记录 (未开票)</h3>
                <div className="flex space-x-2">
                   <div className="relative">
                     <Search size={16} className="absolute left-3 top-2 text-slate-400" />
                     <input type="text" placeholder="搜索账单" className="pl-9 pr-4 py-1.5 border-slate-200 rounded-lg text-sm" />
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { type: '扫码支付', amount: 3000, date: '2023-11-01' },
                  { type: '银行转账', amount: 50000, date: '2023-10-25', subject: '上海未来创意设计有限公司' }
                ].map((record, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <div className="font-semibold text-slate-800">{record.type}</div>
                      <div className="text-xs text-slate-500">{record.date} {record.subject ? `· ${record.subject}` : ''}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-bold text-slate-900">￥{record.amount.toLocaleString()}</div>
                      <button className="text-blue-600 font-semibold text-sm hover:underline">申请发票</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-medium opacity-80">当前可用 Muse 点</span>
                <Shield size={24} className="opacity-80" />
              </div>
              <div className="text-4xl font-black mb-2">124,500</div>
              <p className="text-xs opacity-70 mb-8">积分将于 2024-12-31 到期</p>
              <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition">立即充值</button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">生效主体</h3>
              <div className="space-y-3">
                {subjects.map(s => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                    <div className="font-bold text-slate-800">{s.name}</div>
                    <div className="text-xs text-slate-500 mt-1">税号: {s.taxId}</div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setView('subjects')}
                className="w-full mt-4 flex items-center justify-center space-x-1 text-blue-600 text-sm font-bold py-2 border border-blue-100 rounded-lg hover:bg-blue-50 transition"
              >
                <Plus size={16} />
                <span>添加新主体</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'subjects' && <SubjectManager subjects={subjects} setSubjects={setSubjects} />}
    </div>
  );
};

const SubjectManager: React.FC<{ subjects: Subject[], setSubjects: any }> = ({ subjects, setSubjects }) => {
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');

  const addSubject = () => {
    if (!name || !taxId) return;
    setSubjects([...subjects, { id: Date.now().toString(), name, taxId, source: 'CLIENT_ENTRY' }]);
    setName('');
    setTaxId('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">合同主体管理</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center space-x-2 text-blue-700 font-bold mb-1">
              <Info size={18} />
              <span>录入提示</span>
            </div>
            <p className="text-sm text-blue-600">该主体将用于生成合同、校验银行打款、开发票，请确保主体信息正确。</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">公司全称</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入营业执照上的公司全称"
                className="w-full border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">统一社会信用代码</label>
              <input 
                type="text" 
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="18位税号"
                className="w-full border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={addSubject}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              保存主体信息
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-500 uppercase text-xs tracking-widest">已保存的主体 ({subjects.length})</h3>
          {subjects.map(s => (
            <div key={s.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 relative group">
              <div className="font-bold text-slate-900">{s.name}</div>
              <div className="text-sm text-slate-500 mt-1">税号: {s.taxId}</div>
              <div className="mt-4 flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.source === 'CONTRACT_HISTORY' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {s.source === 'CONTRACT_HISTORY' ? '已验证' : '手动录入'}
                </span>
              </div>
              <button className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">删除</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
