import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText, RefreshCw, Printer } from 'lucide-react';
import { confirmContract, getPendingContracts, PendingContractDto } from '../../services/contractApi';

const ContractReview: React.FC = () => {
  const [contracts, setContracts] = useState<PendingContractDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const loadContracts = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getPendingContracts();
      setContracts(list);
    } catch {
      setError('无法加载待审核合同，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleConfirm = async (contractId: string) => {
    setError(null);
    setConfirmingId(contractId);
    try {
      await confirmContract(contractId);
      await loadContracts();
      alert('确认成功');
    } catch {
      setError('确认失败，请稍后重试。');
    } finally {
      setConfirmingId(null);
    }
  };

  const handlePrint = (contract: PendingContractDto) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError('无法打开打印窗口，请检查浏览器设置。');
      return;
    }
    const content = contract.documentContent || '暂无合同内容';
    printWindow.document.write(`
      <html>
        <head>
          <title>合同打印</title>
          <style>
            body { font-family: "Noto Serif SC", "Songti SC", serif; padding: 24px; color: #111827; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            .meta { font-size: 12px; color: #6b7280; margin-bottom: 16px; }
            .content { white-space: pre-wrap; line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>合同内容</h1>
          <div class="meta">合同编号：${contract.contractId}</div>
          <div class="content">${content}</div>
          <script>
            window.onload = () => { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">待审核合同</h2>
          <p className="text-sm text-slate-500">管理员确认后可打印合同并进入后续流程。</p>
        </div>
        <button
          onClick={loadContracts}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          <RefreshCw size={16} />
          刷新
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="text-sm text-slate-500">正在加载合同列表...</div>
      ) : contracts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
          当前没有待审核合同。
        </div>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => {
            const isActive = activeId === contract.contractId;
            return (
              <div key={contract.contractId} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <FileText size={16} />
                      合同编号：{contract.contractId}
                    </div>
                    <div className="text-lg font-semibold text-slate-800">
                      {contract.subjectName || '未命名主体'}
                    </div>
                    <div className="text-sm text-slate-500">
                      金额：￥{contract.amount.toLocaleString()} · 状态：{contract.status}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveId(isActive ? null : contract.contractId)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-slate-300"
                    >
                      {isActive ? '收起合同' : '查看合同'}
                    </button>
                    <button
                      onClick={() => handlePrint(contract)}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-slate-300"
                    >
                      <Printer size={16} />
                      打印
                    </button>
                    <button
                      onClick={() => handleConfirm(contract.contractId)}
                      disabled={confirmingId === contract.contractId}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={16} />
                      {confirmingId === contract.contractId ? '请等待' : '确认'}
                    </button>
                  </div>
                </div>
                {isActive && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                    {contract.documentContent || '暂无合同内容'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContractReview;
