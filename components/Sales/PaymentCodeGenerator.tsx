
import React, { useState } from 'react';
import { QrCode, Download, Share2, Copy, CheckCircle } from 'lucide-react';
import { STANDARD_AMOUNTS } from '../../constants';

const PaymentCodeGenerator: React.FC = () => {
  const [amount, setAmount] = useState(3000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'wechat' | 'alipay'>('wechat');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentAmount = customAmount ? Number(customAmount) : amount;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">生成支付码</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">选择金额</label>
              <div className="grid grid-cols-3 gap-3">
                {STANDARD_AMOUNTS.map(a => (
                  <button 
                    key={a}
                    onClick={() => {
                      setAmount(a);
                      setCustomAmount('');
                    }}
                    className={`py-3 rounded-xl border-2 transition font-bold ${amount === a && !customAmount ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                  >
                    ￥{a.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input 
                  type="number"
                  placeholder="或者输入自定义金额"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">支付平台</label>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setPaymentType('wechat')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl border-2 transition font-semibold ${paymentType === 'wechat' ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <span className="w-5 h-5 bg-green-500 rounded-full"></span>
                  <span>微信支付</span>
                </button>
                <button 
                  onClick={() => setPaymentType('alipay')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl border-2 transition font-semibold ${paymentType === 'alipay' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <span className="w-5 h-5 bg-blue-500 rounded-full"></span>
                  <span>支付宝</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 flex flex-col items-center border border-slate-100 border-dashed">
              <div className="relative bg-white p-4 rounded-xl shadow-md mb-4 group">
                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center border border-slate-100">
                  <QrCode size={120} className="text-slate-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/5 backdrop-blur-sm rounded-xl">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">预览已加密</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider">客户扫码应支付</div>
                <div className="text-3xl font-black text-slate-900">￥{currentAmount.toLocaleString()}</div>
                <p className="text-sm text-slate-500 mt-2">
                  客户完成扫码支付后，资金将自动计入账号并触发合同录入提醒。
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-grow flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-100">
                <Download size={20} />
                <span>保存二维码</span>
              </button>
              <button 
                onClick={handleCopy}
                className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-4 rounded-xl transition"
              >
                {copied ? <CheckCircle size={20} className="text-green-500" /> : <Share2 size={20} />}
                <span>{copied ? '已复制' : '分享连接'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCodeGenerator;
