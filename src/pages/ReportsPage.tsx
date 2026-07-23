import { useState } from 'react';
import { FileText, Save } from 'lucide-react';

export function ReportsPage() {
  const [report, setReport] = useState<null | { type: string; start: string; end: string; total: number; safe: number; warning: number; danger: number; accuracy: number }>(null);
  const [savedReports] = useState([
    { id: 1, type: 'daily', start_date: '2026-07-16', end_date: '2026-07-16', total_predictions: 1, safe_count: 0, warning_count: 0, danger_count: 1, accuracy: 0, created_at: '2026-07-16 13:51:24' },
  ]);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get('report_type') as string;
    const today = new Date().toISOString().split('T')[0];
    const start = type === 'daily' ? today : type === 'weekly' ? new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0] : today.replace(/\d{2}$/, '01');
    setReport({ type, start, end: today, total: 1, safe: 0, warning: 0, danger: 1, accuracy: 0 });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><FileText className="text-yellow-500" size={28} /> Reports</h1>
        <p className="text-gray-400">Generate daily, weekly, and monthly prediction reports</p>
      </div>

      <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mb-6">
        <form onSubmit={generate} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Report Type</label>
            <select name="report_type" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500">
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:translate-y-[-2px] transition-transform flex items-center gap-2"><FileText size={16} /> Generate Report</button>
        </form>
      </div>

      {report && (
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
            <h4 className="font-bold text-white mb-4 capitalize flex items-center gap-2"><FileText className="text-yellow-500" size={18} /> {report.type} Report <span className="text-gray-400 text-sm font-normal">({report.start} to {report.end})</span></h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[{ label: 'Total', value: report.total, cls: '' }, { label: 'Safe', value: report.safe, cls: 'text-green-400' }, { label: 'Warning', value: report.warning, cls: 'text-orange-400' }, { label: 'Danger', value: report.danger, cls: 'text-red-400' }].map((s, i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-800/50 border-l-4 border-yellow-500">
                  <div className={`text-2xl font-extrabold ${s.cls}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-2 h-48">
              {[{ label: 'Safe', value: report.safe, color: 'bg-green-500' }, { label: 'Warning', value: report.warning, color: 'bg-orange-500' }, { label: 'Dangerous', value: report.danger, color: 'bg-red-500' }].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className={`w-full ${bar.color} rounded-t`} style={{ height: `${report.total ? (bar.value / report.total) * 100 : 0}%`, minHeight: bar.value > 0 ? '20px' : '2px' }} />
                  <span className="text-xs text-gray-500 mt-2">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
            <h5 className="font-bold text-white mb-3 flex items-center gap-2"><Save className="text-yellow-500" size={18} /> Accuracy</h5>
            <div className="text-center py-4">
              <div className="text-4xl font-extrabold text-yellow-500">{report.accuracy}%</div>
              <p className="text-gray-400 text-sm">Safe prediction rate</p>
            </div>
            <div className="border-t border-yellow-500/15 pt-3 space-y-2">
              <div className="flex justify-between"><span className="text-gray-400">Total Predictions</span><span className="font-bold text-white">{report.total}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Safe</span><span className="text-green-400">{report.safe}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Warning</span><span className="text-orange-400">{report.warning}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Dangerous</span><span className="text-red-400">{report.danger}</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 overflow-x-auto">
        <h5 className="font-bold text-white mb-3 flex items-center gap-2"><Save className="text-yellow-500" size={18} /> Saved Reports</h5>
        <table className="w-full text-sm">
          <thead><tr className="text-yellow-500 uppercase text-xs tracking-wide border-b border-yellow-500/20">
            <th className="p-3 text-left">ID</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Period</th><th className="p-3 text-left">Total</th><th className="p-3 text-left">Safe</th><th className="p-3 text-left">Warning</th><th className="p-3 text-left">Danger</th><th className="p-3 text-left">Accuracy</th><th className="p-3 text-left">Generated</th>
          </tr></thead>
          <tbody>
            {savedReports.map(r => (
              <tr key={r.id} className="border-b border-white/5">
                <td className="p-3">{r.id}</td><td className="p-3 capitalize">{r.type}</td><td className="p-3">{r.start_date} - {r.end_date}</td>
                <td className="p-3">{r.total_predictions}</td><td className="p-3 text-green-400">{r.safe_count}</td><td className="p-3 text-orange-400">{r.warning_count}</td><td className="p-3 text-red-400">{r.danger_count}</td>
                <td className="p-3">{r.accuracy}%</td><td className="p-3 text-gray-400 text-xs">{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
