import { useState } from 'react';
import { Mountain, Home, Shield, Phone, Book, LayoutDashboard, Upload, History, FileText, Settings, ShieldCheck, LogOut, LogIn } from 'lucide-react';

type Page = 'home' | 'login' | 'dashboard' | 'upload' | 'prediction' | 'history' | 'reports' | 'settings' | 'admin' | 'mine-info' | 'emergency' | 'documentation';

interface User {
  username: string;
  role: string;
}

interface AppState {
  currentPage: Page;
  user: User | null;
  lastPrediction: PredictionResult | null;
}

export interface PredictionResult {
  class_name: string;
  confidence: number;
  risk_level: string;
  prediction_time: number;
  all_probabilities: Record<string, number>;
  alert_type: string;
  alert_message: string;
  filename: string;
  imageUrl: string;
}

const STORAGE_KEY = 'rockguard_user';

export function useApp() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return {
      currentPage: 'home',
      user: saved ? JSON.parse(saved) : null,
      lastPrediction: null,
    };
  });

  const navigate = (page: Page) => setState(s => ({ ...s, currentPage: page }));

  const login = (username: string, role: string) => {
    const user = { username, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setState(s => ({ ...s, user, currentPage: 'dashboard' }));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(s => ({ ...s, user: null, currentPage: 'home' }));
  };

  const setPrediction = (p: PredictionResult) =>
    setState(s => ({ ...s, lastPrediction: p, currentPage: 'prediction' }));

  return { state, navigate, login, logout, setPrediction };
}

const navItems: { page: Page; label: string; icon: typeof Home; auth?: boolean; admin?: boolean }[] = [
  { page: 'home', label: 'Home', icon: Home },
  { page: 'mine-info', label: 'Mine Info', icon: Shield },
  { page: 'emergency', label: 'Emergency', icon: Phone },
  { page: 'documentation', label: 'Docs', icon: Book },
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, auth: true },
  { page: 'upload', label: 'Upload', icon: Upload, auth: true },
  { page: 'history', label: 'History', icon: History, auth: true },
  { page: 'reports', label: 'Reports', icon: FileText, auth: true },
  { page: 'settings', label: 'Settings', icon: Settings, auth: true },
  { page: 'admin', label: 'Admin', icon: ShieldCheck, auth: true, admin: true },
];

export function Navbar({ state, navigate, logout }: { state: AppState; navigate: (p: Page) => void; logout: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/85 border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('home')} className="flex items-center gap-2 text-yellow-500 font-extrabold text-xl">
          <Mountain size={24} /> RockGuard AI
        </button>
        <button className="lg:hidden text-yellow-500" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
        <div className={`${open ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-1 absolute lg:static top-full left-0 right-0 bg-black/95 lg:bg-transparent p-4 lg:p-0`}>
          {navItems.map(item => {
            if (item.auth && !state.user) return null;
            if (item.admin && state.user?.role !== 'admin') return null;
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                onClick={() => { navigate(item.page); setOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  state.currentPage === item.page ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/5'
                }`}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
          {state.user ? (
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10">
              <LogOut size={16} /> Logout ({state.user.username})
            </button>
          ) : (
            <button onClick={() => navigate('login')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-yellow-500 hover:bg-yellow-500/10">
              <LogIn size={16} /> Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-yellow-500/15 bg-black/90 py-6 text-center text-gray-500 mt-12">
      <p className="flex items-center justify-center gap-1.5">
        <Mountain size={16} className="text-yellow-500" /> <strong className="text-gray-300">RockGuard AI</strong> — AI-Based Rockfall Prediction and Alert System for Open Pit Mines
      </p>
      <p className="text-xs mt-1">Final Year Engineering Project © 2025 | Built with React, TensorFlow & Chart.js</p>
    </footer>
  );
}

export { STORAGE_KEY };
export type { Page, User };
