import React, { useState } from 'react';

const TEST_ACCOUNTS = [
  { email: 'admin@test.com', password: '123456', role: '管理员' },
  { email: 'sales@test.com', password: '123456', role: '销售' },
  { email: 'finance@test.com', password: '123456', role: '财务' },
  { email: 'client@test.com', password: '123456', role: '客户' }
];

type LoginPageProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string | null;
  loading?: boolean;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="mb-6">
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">MuseGate</div>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">登录系统</h1>
            <p className="text-slate-500 mt-2">请输入账号密码以继续访问合同与财务功能。</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@musegate.local"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                密码
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入密码"
                required
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 text-red-600 text-sm px-3 py-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
          <div className="text-sm font-semibold text-slate-300 uppercase tracking-widest">测试账号列表</div>
          <p className="text-slate-300 mt-2 mb-6">使用以下账号快速体验不同角色的菜单与功能。</p>
          <div className="space-y-4">
            {TEST_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-semibold">{account.role}</div>
                  <div className="text-xs text-slate-400">{account.email}</div>
                </div>
                <div className="text-sm text-slate-200">{account.password}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
