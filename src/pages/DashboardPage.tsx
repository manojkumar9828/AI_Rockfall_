import { Images, CheckCircle, AlertCircle, XCircle, Bell, Upload, History, FileText, Settings, LayoutDashboard } from 'lucide-react';
import type { Page } from '../store.tsx';

export function DashboardPage({ navigate }: { navigate: (p: Page) => void }) {
  const stats = { total: 1, safe: 0, warning: 0, danger: 1, alerts: 1 };
  const cards = [
    { icon: Images, label: 'Total Images', value: stats.total, color: 'text-yellow-500', bar: 'bg-yellow-500' },
    { icon: CheckCircle, label: 'Safe Predictions', value: stats.safe, color: 'text-green-400', bar: 'bg-green-500' },
    { icon: AlertCircle, label: 'Warnings', value: stats.warning, color: 'text-orange-400', bar: 'bg-orange-500' },
    { icon: XCircle, label: 'Dangerous', value: stats.danger, color: 'text-red-400', bar: 'bg-red-500' },
    { icon: Bell, label: 'Alerts Generated', value: stats.alerts, color: 'text-yellow-500', bar: 'bg-yellow-500' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><LayoutDashboard className="text-yellow-500" size={28} /> Dashboard</h1>
        <p className="text-gray-400">Real-time monitoring overview and prediction statistics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="p-5 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 relative overflow-hidden hover:translate-y-[-3px] transition-transform">
              <div className={`absolute top-0 left-0 w-1 h-full ${card.bar}`} />
              <Icon size={28} className={card.color} />
              <div className="text-3xl font-extrabold text-white mt-2">{card.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts placeholder */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
          <h5 className="font-bold text-white mb-4">Risk Distribution</h5>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Safe', value: stats.safe, color: 'bg-green-500' },
              { label: 'Warning', value: stats.warning, color: 'bg-orange-500' },
              { label: 'Dangerous', value: stats.danger, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1"><span>{item.label}</span><span>{item.value}</span></div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${stats.total ? (item.value / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
          <h5 className="font-bold text-white mb-4">Prediction Statistics</h5>
          <div className="space-y-3">
            {[
              { label: 'Safe', value: stats.safe, color: 'bg-green-500' },
              { label: 'Warning', value: stats.warning, color: 'bg-orange-500' },
              { label: 'Dangerous', value: stats.danger, color: 'bg-red-500' },
              { label: 'Alerts', value: stats.alerts, color: 'bg-yellow-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="text-white font-bold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
          <h5 className="font-bold text-white mb-4">Prediction Trend (7 days)</h5>
          <div className="flex items-end gap-2 h-32">
            {[0, 0, 0, 0, 0, 0, 1].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-yellow-500 to-orange-600 rounded-t" style={{ height: `${v * 100}%`, minHeight: v > 0 ? '20px' : '2px' }} />
                <span className="text-xs text-gray-500 mt-1">D{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
        <h5 className="font-bold text-white mb-3">Quick Actions</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => navigate('upload')} className="py-3 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center gap-2"><Upload size={16} /> New Detection</button>
          <button onClick={() => navigate('history')} className="py-3 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center gap-2"><History size={16} /> History</button>
          <button onClick={() => navigate('reports')} className="py-3 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center gap-2"><FileText size={16} /> Reports</button>
          <button onClick={() => navigate('settings')} className="py-3 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center gap-2"><Settings size={16} /> Settings</button>
        </div>
      </div>
    </div>
  );
}
