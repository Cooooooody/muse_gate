
import React, { useState, useEffect } from 'react';
import { Search, Info, CheckCircle2, AlertCircle, FileText, Send, Eye } from 'lucide-react';
import { PaymentType, Subject, PaymentRecord, ContractStatus } from '../../types';
import { STANDARD_AMOUNTS, MOCK_PACKAGES } from '../../constants';
import { generateContractPreview } from '../../services/geminiService';

const SalesContractEntry: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isBankTransfer, setIsBankTransfer] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const [matchedPayment, setMatchedPayment] = useState<PaymentRecord | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [bonusItems, setBonusItems] = useState<string[]>([]);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    mgAccount: '',
    mgPhone: '',
    address: '',
    taxId: '',
  });

  // Mock History for Public-to-Public
  const [bankHistory] = useState<Subject[]>([
    { id: '1', name: '上海世纪出版集团', taxId: '9131000012345678X', source: 'BANK' },
    { id: '2', name: '阿里巴巴(中国)网络技术有限公司', taxId: '9133010071256055X', source: 'BANK' },
  ]);

  const [clientSubjects] = useState<Subject[]>([
    { id: '3', name: '个人主体A', source: 'CLIENT_ENTRY' },
  ]);

  const handleSubjectSelect = (name: string) => {
    setSubjectName(name);
    setIsManualInput(false);
  };

  const nextStep = async () => {
    if (step === 2) {
      setIsGenerating(true);
      const content = await generateContractPreview({
        subjectName,
        amount,
        mainAccountName: formData.mgAccount,
        mainAccountPhone: formData.mgPhone,
        items: ['标准API服务'],
        bonusItems,
        address: formData.address
      });
      setPreviewContent(content);
      setIsGenerating(false);
    }
    setStep(s => s + 1);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Progress Tracker */}
      <div className="flex items-center justify-between mb-8 px-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center flex-1 relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 ${step >= i ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {i}
            </div>
            <span className={`text-xs mt-2 font-medium ${step >= i ? 'text-blue-600' : 'text-slate-400'}`}>
              {i === 1 ? '主体信息' : i === 2 ? '套餐/金额' : '生成预览'}
            </span>
            {i < 3 && <div className={`absolute top-5 left-1/2 w-full h-0.5 ${step > i ? 'bg-blue-600' : 'bg-slate-200'}`}></div>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {step === 1 && (
          <div className="p-8 space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex items-start space-x-3">
              <Info className="text-amber-600 mt-0.5" size={18} />
              <p className="text-sm text-amber-800 leading-relaxed">
                提醒：该合同主体会用于打款和开发票，请确保此处主体与打款主体和发票主体一致，否则无法开票。
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isBankTransfer}
                  onChange={(e) => setIsBankTransfer(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold text-slate-700">是否公对公转账?</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">MuseGate 主账号名称</label>
                  <input 
                    type="text" 
                    value={formData.mgAccount}
                    onChange={(e) => setFormData({...formData, mgAccount: e.target.value})}
                    placeholder="请输入账号名称" 
                    className="w-full border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">主账号手机号</label>
                  <input 
                    type="tel" 
                    value={formData.mgPhone}
                    onChange={(e) => setFormData({...formData, mgPhone: e.target.value})}
                    placeholder="请输入手机号" 
                    className="w-full border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">合同主体名称</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={subjectName}
                    onChange={(e) => {
                      setSubjectName(e.target.value);
                      setIsManualInput(true);
                    }}
                    placeholder={isBankTransfer ? "请在历史记录中查找或输入匹配名称" : "请输入或选择主体"} 
                    className={`w-full border-slate-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 ${isBankTransfer && !isManualInput ? 'bg-slate-50' : ''}`}
                    disabled={isBankTransfer && !isManualInput && subjectName !== ''}
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>
                
                {/* Search Suggestion Area */}
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">推荐选项</div>
                  <div className="flex flex-wrap gap-2">
                    {(isBankTransfer ? bankHistory : clientSubjects).map(s => (
                      <button 
                        key={s.id}
                        onClick={() => handleSubjectSelect(s.name)}
                        className={`px-3 py-1.5 rounded-full text-sm transition border ${subjectName === s.name ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-200 hover:border-blue-300 text-slate-600'}`}
                      >
                        {s.name}
                      </button>
                    ))}
                    {!isBankTransfer && (
                      <button 
                        onClick={() => setIsManualInput(true)}
                        className="px-3 py-1.5 rounded-full text-sm bg-slate-200 text-slate-700 hover:bg-slate-300"
                      >
                        + 自由录入
                      </button>
                    )}
                  </div>
                  {isBankTransfer && subjectName && !bankHistory.some(h => h.name === subjectName) && (
                    <div className="mt-2 text-xs text-red-500 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>公对公转账必须匹配银行记录，未找到该主体，请核对。</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">收货地址 (邮寄地址)</label>
                <textarea 
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="请输入纸质合同邮寄地址"
                  className="w-full border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">充值套餐选择</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {MOCK_PACKAGES.map((pkg) => (
                  <button 
                    key={pkg.name}
                    onClick={() => {
                      setAmount(pkg.amount);
                      setBonusItems(pkg.bonus);
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition ${amount === pkg.amount ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="text-sm font-bold text-slate-400 mb-1">{pkg.name}</div>
                    <div className="text-2xl font-black text-slate-900">￥{pkg.amount.toLocaleString()}</div>
                    <div className="mt-3 space-y-1">
                      {pkg.bonus.map(b => (
                        <div key={b} className="text-xs text-slate-500 flex items-center space-x-1">
                          <CheckCircle2 size={12} className="text-green-500" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">合同总金额</label>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="输入自定义金额"
                  className="flex-grow border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-xl font-bold"
                />
                <select 
                  className="border-slate-300 rounded-lg px-4 py-2"
                  onChange={(e) => setAmount(Number(e.target.value))}
                  value={amount}
                >
                  <option value={0}>选择标准金额</option>
                  {STANDARD_AMOUNTS.map(a => <option key={a} value={a}>￥{a.toLocaleString()}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">额外赠送内容 (可改)</label>
              <div className="space-y-2">
                {bonusItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={item}
                      onChange={(e) => {
                        const newBonus = [...bonusItems];
                        newBonus[idx] = e.target.value;
                        setBonusItems(newBonus);
                      }}
                      className="flex-grow border-slate-300 rounded-lg px-4 py-1.5 text-sm"
                    />
                    <button 
                      onClick={() => setBonusItems(bonusItems.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-500"
                    >
                      删除
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setBonusItems([...bonusItems, ''])}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + 添加赠送项
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Eye className="text-blue-600" size={20} />
                <span>合同预览生成中...</span>
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-slate-100 rounded hover:bg-slate-200">打印</button>
                <button className="px-3 py-1 text-xs bg-slate-100 rounded hover:bg-slate-200">下载 PDF</button>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 min-h-[400px] font-serif leading-relaxed text-slate-800 shadow-inner">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                  <p>正在使用 Gemini AI 生成合规合同文档...</p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap prose prose-slate max-w-none">
                  {previewContent}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`px-6 py-2 rounded-lg font-semibold transition ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            返回上一步
          </button>
          
          <div className="flex space-x-3">
            <button className="px-6 py-2 rounded-lg text-slate-500 hover:bg-slate-200 transition">
              存为草稿
            </button>
            <button 
              onClick={step === 3 ? () => alert("已提交给主管审核") : nextStep}
              disabled={step === 1 && !subjectName}
              className={`flex items-center space-x-2 px-8 py-2 rounded-lg font-semibold transition shadow-lg ${step === 1 && !subjectName ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}
            >
              <span>{step === 3 ? '提交审核' : '继续'}</span>
              {step === 3 ? <Send size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default SalesContractEntry;
