import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { getLedgerEntries, LedgerEntry } from '../../services/ledgerApi';

const LedgerList: React.FC = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getLedgerEntries();
      setEntries(list);
    } catch {
      setError('无法加载入账记录，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">入账记录</h2>
          <p className="text-sm text-slate-500">确认合同时会自动生成入账记录。</p>
        </div>
        <button
          onClick={loadEntries}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          <RefreshCw size={16} />
          刷新
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="text-sm text-slate-500">正在加载入账记录...</div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
          暂无入账记录。
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">MG账号</th>
                <th className="px-4 py-3 text-left font-semibold">金额</th>
                <th className="px-4 py-3 text-left font-semibold">类型</th>
                <th className="px-4 py-3 text-left font-semibold">来源ID</th>
                <th className="px-4 py-3 text-left font-semibold">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 text-slate-700">{entry.mgAccount || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">￥{entry.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {entry.sourceType === 'qr' ? '扫码支付' : '银行转账'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{entry.sourceId || '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{entry.createdAt || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LedgerList;
