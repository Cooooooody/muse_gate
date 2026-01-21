
import React, { useEffect, useState } from 'react';
import {
  FileText,
  CreditCard,
  User,
  ShieldCheck,
  LayoutDashboard,
  History,
  QrCode,
  Bell,
  LogOut,
  ChevronRight
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import SalesContractEntry from './components/Sales/SalesContractEntry';
import PaymentCodeGenerator from './components/Sales/PaymentCodeGenerator';
import ClientPortal from './components/Client/ClientPortal';
import FinancePanel from './components/Finance/FinancePanel';
import LoginPage from './components/Auth/LoginPage';
import { getProfile, upsertProfile } from './services/profileApi';
import { getReminders } from './services/reminderApi';
import { performLogout } from './services/logout';
import { getSessionSafe } from './services/authBootstrap';
import { mapEmailToRole } from './services/roleMapper';
import { supabase } from './services/supabaseClient';
import { UserRole } from './types';

export function __test_role(email: string) {
  return mapEmailToRole(email);
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reminderAccount, setReminderAccount] = useState<string | null>(null);
  const [reminderAmount, setReminderAmount] = useState<string | null>(null);

  const resolveRoleForUser = async (userId: string, email: string | null) => {
    const fallbackRole = mapEmailToRole(email ?? '');
    const { data, error } = await getProfile(userId);
    if (error) {
      return fallbackRole;
    }
    if (data) {
      return data.role;
    }

    const { error: upsertError } = await upsertProfile({
      id: userId,
      email: email ?? '',
      role: fallbackRole
    });

    if (upsertError) {
      return fallbackRole;
    }

    return fallbackRole;
  };

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      const { session: nextSession } = await getSessionSafe(() =>
        supabase.auth.getSession()
      );
      if (cancelled) {
        return;
      }
      setSession(nextSession);
      if (nextSession?.user) {
        const nextRole = await resolveRoleForUser(
          nextSession.user.id,
          nextSession.user.email ?? null
        );
        if (!cancelled) {
          setRole(nextRole);
        }
      } else {
        setRole(null);
      }
      setInitializing(false);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user) {
          const nextRole = await resolveRoleForUser(
            nextSession.user.id,
            nextSession.user.email ?? null
          );
          setRole(nextRole);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Simulated logic for daily sales reminder
  useEffect(() => {
    const isSalesRole = role === UserRole.SALES || role === UserRole.ADMIN;
    if (isSalesRole) {
      getReminders()
        .then((list) => {
          if (list.length > 0) {
            setReminderAccount(list[0].mgAccount);
            setReminderAmount(list[0].amount.toLocaleString());
            setShowReminder(true);
          } else {
            setReminderAccount(null);
            setReminderAmount(null);
            setShowReminder(false);
          }
        })
        .catch(() => {
          setReminderAccount(null);
          setReminderAmount(null);
        });
    }
  }, [role]);

  const handleLogin = async (email: string, password: string) => {
    setAuthError(null);
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setAuthError(error.message || '登录失败，请检查账号密码');
      setAuthLoading(false);
      return;
    }
    setSession(data.session ?? null);
    if (data.user) {
      const nextRole = await resolveRoleForUser(
        data.user.id,
        data.user.email ?? null
      );
      setRole(nextRole);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await performLogout({
      signOut: (options) => supabase.auth.signOut(options),
      onReset: () => {
        setSession(null);
        setRole(null);
        setActiveTab('dashboard');
        setAuthError(null);
      }
    });
  };

  const isSalesRole = role === UserRole.SALES || role === UserRole.ADMIN;
  const roleLabel = role ?? UserRole.SALES;

  const renderContent = () => {
    const resolvedRole = role ?? UserRole.SALES;
    switch (role) {
      case UserRole.ADMIN:
      case UserRole.SALES:
        if (activeTab === 'contract') return <SalesContractEntry />;
        if (activeTab === 'qrcode') return <PaymentCodeGenerator />;
        return <DashboardOverview role={resolvedRole} />;
      case UserRole.CLIENT:
        return <ClientPortal />;
      case UserRole.FINANCE:
        return <FinancePanel />;
      default:
        return <DashboardOverview role={resolvedRole} />;
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        正在加载...
      </div>
    );
  }

  if (!session) {
    return (
      <LoginPage
        onLogin={handleLogin}
        error={authError}
        loading={authLoading}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">MuseGate</span>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-2">菜单</div>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span>工作台</span>
          </button>

          {isSalesRole && (
            <>
              <button 
                onClick={() => setActiveTab('contract')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'contract' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
              >
                <FileText size={20} />
                <span>合同录入</span>
              </button>
              <button 
                onClick={() => setActiveTab('qrcode')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'qrcode' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
              >
                <QrCode size={20} />
                <span>支付码生成</span>
              </button>
            </>
          )}

          {role === UserRole.CLIENT && (
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">
              <History size={20} />
              <span>合同 & 发票</span>
            </button>
          )}

          {role === UserRole.FINANCE && (
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">
              <CreditCard size={20} />
              <span>对账中心</span>
            </button>
          )}
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-grow flex flex-col min-w-0 bg-slate-50 overflow-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">{roleLabel}面板</h2>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-4 border-slate-200">
              <div className="text-right">
                <div className="text-sm font-medium">{session.user.email ?? '已登录用户'}</div>
                <div className="text-xs text-slate-400">{roleLabel}</div>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-slate-500" />
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <LogOut size={16} />
              <span>退出</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>

      {/* Daily Reminder Modal */}
      {showReminder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">待录入合同提醒</h3>
            <p className="text-slate-500 text-center mb-8">
              系统检测到您有名下客户（MG账号: {reminderAccount || '未知'}）已完成公对公转账
              {reminderAmount ? ` ${reminderAmount} 元` : ''}。请尽快补充合同信息以完成后续流程。
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => { setShowReminder(false); setActiveTab('contract'); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-200"
              >
                立即去录合同
              </button>
              <button 
                onClick={() => setShowReminder(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition"
              >
                稍后提醒
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardOverview: React.FC<{ role: UserRole }> = ({ role }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="今日录入合同" value="12" change="+20%" color="blue" />
        <StatCard title="待审核合同" value="5" change="-10%" color="orange" />
        <StatCard title="待匹配转账" value="￥240,000" change="+5%" color="green" />
        <StatCard title="本月业绩" value="￥1,200,000" change="+15%" color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">最近操作</h3>
          <button className="text-sm text-blue-600 hover:underline">查看全部</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                  MG
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800">上海缪斯网络科技有限公司</div>
                  <div className="text-xs text-slate-400">2023-10-24 14:30 · 合同草稿生成</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, change: string, color: string }> = ({ title, value, change, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="text-slate-500 text-sm mb-1">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className={`text-xs font-semibold px-2 py-1 rounded ${change.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {change}
        </div>
      </div>
      <div className={`mt-4 h-1 w-full rounded-full ${colorMap[color]} opacity-20`}></div>
    </div>
  );
};

export default App;
