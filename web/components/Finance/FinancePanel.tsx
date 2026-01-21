
import React, { useEffect, useState } from 'react';
import { CreditCard, ArrowRightLeft, CheckCircle2, AlertCircle, Search, Plus } from 'lucide-react';
import { PaymentRecord, PaymentType } from '../../types';
import { createBankTransfer } from '../../services/financeApi';
import { getUnmatchedPayments } from '../../services/paymentApi';

const FinancePanel: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newPayment, setNewPayment] = useState({
    senderName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    mgAccount: '',
  });

  const fetchUnmatched = () => {
    setIsLoading(true);
    getUnmatchedPayments()
      .then((list) => {
        const mapped = list.map((item) => ({
          id: item.paymentId,
          type: item.paymentType === 'bank_transfer' ? PaymentType.BANK_TRANSFER : PaymentType.QR,
          amount: item.amount,
          senderName: item.mgAccount || item.paymentId,
          date: item.occurredAt || '',
          isMatched: false,
          mgAccount: item.mgAccount,
        }));
        setPayments(mapped);
        setErrorMessage(null);
      })
      .catch(() => {
        setErrorMessage('无法加载对账数据，请稍后重试。');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUnmatched();
  }, []);

  const handleAddPayment = async () => {
    if (!newPayment.senderName || !newPayment.amount) return;
    try {
      await createBankTransfer({
        senderName: newPayment.senderName,
        amount: Number(newPayment.amount),
        receivedAt: newPayment.date,
        mgAccount: newPayment.mgAccount || undefined,
      });
      setNewPayment({
        senderName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        mgAccount: '',
      });
      fetchUnmatched();
    } catch (error) {
      setErrorMessage('录入失败，请稍后重试。');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <Plus className="text-blue-600" size={20} />
              <span>录入公对公款项</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">付款方名称</label>
                <input 
                  type="text" 
                  value={newPayment.senderName}
                  onChange={(e) => setNewPayment({...newPayment, senderName: e.target.value})}
                  className="w-full border-slate-200 rounded-xl px-4 py-3"
                  placeholder="银行流水显示的付款名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">金额 (￥)</label>
                <input 
                  type="number" 
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                  className="w-full border-slate-200 rounded-xl px-4 py-3"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">到账日期</label>
                <input 
                  type="date" 
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                  className="w-full border-slate-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">MG账号 (可选)</label>
                <input 
                  type="text" 
                  value={newPayment.mgAccount}
                  onChange={(e) => setNewPayment({...newPayment, mgAccount: e.target.value})}
                  className="w-full border-slate-200 rounded-xl px-4 py-3"
                  placeholder="用于匹配客户账号"
                />
              </div>
              <button 
                onClick={handleAddPayment}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg"
              >
                确认录入
              </button>
            </div>
          </div>
        </div>

        {/* List & Reconciliation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                <ArrowRightLeft className="text-blue-600" size={18} />
                <span>流水对账</span>
              </h3>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">最近7天记录</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {isLoading && (
                <div className="p-6 text-sm text-slate-500">正在加载对账数据...</div>
              )}
              {errorMessage && (
                <div className="p-6 text-sm text-red-500">{errorMessage}</div>
              )}
              {!isLoading && !errorMessage && payments.length === 0 && (
                <div className="p-6 text-sm text-slate-500">暂无未匹配记录。</div>
              )}
              {payments.map(p => (
                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.type === PaymentType.BANK_TRANSFER ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{p.senderName}</div>
                      <div className="text-sm text-slate-500 flex items-center space-x-2">
                        <span>{p.date}</span>
                        <span>·</span>
                        <span className="uppercase text-[10px] font-black tracking-tighter px-1.5 py-0.5 rounded border border-slate-200">
                          {p.type === PaymentType.BANK_TRANSFER ? '银行转账' : '扫码支付'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900">￥{p.amount.toLocaleString()}</div>
                    <div className={`text-xs font-bold flex items-center justify-end space-x-1 mt-1 ${p.isMatched ? 'text-green-600' : 'text-amber-600'}`}>
                      {p.isMatched ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>已关联合同</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} />
                          <span>待销售关联</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-4 flex items-center space-x-2">
              <AlertCircle size={18} />
              <span>对账异常警报</span>
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-amber-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">款项未录合同 (3笔)</div>
                  <p className="text-xs text-slate-500">存在到账超过48小时未被销售关联的流水</p>
                </div>
                <button className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-lg transition">
                  通知销售负责人
                </button>
              </div>
              <div className="p-4 bg-white rounded-xl border border-amber-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">金额不匹配 (1笔)</div>
                  <p className="text-xs text-slate-500">销售录入金额(￥10,000)与实收金额(￥9,500)不符</p>
                </div>
                <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-lg transition">
                  人工核对
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePanel;
