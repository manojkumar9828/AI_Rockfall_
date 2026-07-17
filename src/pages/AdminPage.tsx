import { useState } from 'react';
import { ShieldCheck, Users, Images, FileText, Terminal, Plus, Trash2 } from 'lucide-react';

export function AdminPage() {
  const [tab, setTab] = useState<'users' | 'predictions' | 'reports' | 'logs'>('users');
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', email: 'admin@rockfall.ai', role: 'admin', created_at: '2026-07-16 13:51:23' },
    { id: 2, username: 'user', email: 'user@rockfall.ai', role: 'user', created_at: '2026-07-16 13:51:23' },
  ]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  const preds = [{ id: 1, image_name: '20260716_135124_test.png', prediction: 'Dangerous', confidence: 70.34, risk_level: 'High', created_date: '2026-07-16', created_time: '13:51:24' }];
  const reports = [{ id: 1, type: 'daily', start_date: '2026-07-16', end_date: '2026-07-16', total_predictions: 1, accuracy: 0, created_at: '2026-07-16 13:51:24' }];
  const logs = [
    { id: 1, user_id: 1, action: 'login', details: 'User admin logged in', created_at: '2026-07-16 13:51:23' },
    { id: 2, user_id: 1, action: 'upload', details: 'Uploaded test.png', created_at: '2026-07-16 13:51:24' },
    { id: 3, user_id: 1, action: 'predict', details: 'Predicted: Dangerous (70.34%)', created_at: '2026-07-16 13:51:24' },
  ];

  const tabs = [
    { key: 'users' as const, label: 'Users', icon: Users },
    { key: 'predictions' as const, label: 'Predictions', icon: Images },
    { key: 'reports' as const, label: 'Reports', icon: FileText },
    { key: 'logs' as const, label: 'System Logs', icon: Terminal },
  ];

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.username && newUser.email && newUser.password) {
      setUsers([...users, { id: users.length + 1, username: newUser.username, email: newUser.email, role: newUser.role, created_at: new Date().toISOString().replace('T', ' ').slice(0, 19) }]);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
    }
  };

  const deleteUser = (id: number) => {
    if (confirm('Delete this user?')) setUsers(users.filter(u => u.id !== id));
  };

  const badgeClass = (pred: string) => pred === 'Safe' ? 'bg-green-500/20 text-green-400' : pred === 'Warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400';
  const riskClass = (risk: string) => risk === 'Low' ? 'bg-green-500/20 text-green-400' : risk === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><ShieldCheck className="text-yellow-500" size={28} /> Admin Panel</h1>
        <p className="text-gray-400">System administration and management</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${tab === t.key ? 'bg-yellow-500 text-black' : 'bg-gray-800/50 text-gray-400 hover:text-yellow-500'}`}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'users' && (
        <div>
          <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mb-4">
            <h5 className="font-bold text-white mb-3 flex items-center gap-2"><Plus className="text-yellow-500" size={18} /> Create New User</h5>
            <form onSubmit={addUser} className="flex flex-wrap gap-3">
              <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} className="flex-1 min-w-32 px-4 py-2.5 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500" />
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="flex-1 min-w-32 px-4 py-2.5 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500" />
              <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="flex-1 min-w-32 px-4 py-2.5 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500" />
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="px-4 py-2.5 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500">
                <option value="user">User</option><option value="admin">Admin</option>
              </select>
              <button type="submit" className="px-4 py-2.5 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600"><Plus size={18} /></button>
            </form>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-yellow-500 uppercase text-xs tracking-wide border-b border-yellow-500/20"><th className="p-3 text-left">ID</th><th className="p-3 text-left">Username</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Created</th><th className="p-3 text-left">Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="p-3">{u.id}</td>
                    <td className="p-3 text-white">{u.username}</td>
                    <td className="p-3 text-gray-400">{u.email}</td>
                    <td className="p-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{u.role}</span></td>
                    <td className="p-3 text-gray-400 text-xs">{u.created_at}</td>
                    <td className="p-3"><button onClick={() => deleteUser(u.id)} className="px-2.5 py-1.5 rounded-lg bg-red-500/15 border border-red-500 text-red-400 hover:bg-red-500/25"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'predictions' && (
        <div className="p-4 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-yellow-500 uppercase text-xs tracking-wide border-b border-yellow-500/20"><th className="p-3 text-left">ID</th><th className="p-3 text-left">Image</th><th className="p-3 text-left">Prediction</th><th className="p-3 text-left">Confidence</th><th className="p-3 text-left">Risk</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Time</th></tr></thead>
            <tbody>
              {preds.map(p => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="p-3">{p.id}</td><td className="p-3 text-gray-300">{p.image_name}</td>
                  <td className="p-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass(p.prediction)}`}>{p.prediction}</span></td>
                  <td className="p-3 text-white">{p.confidence}%</td>
                  <td className="p-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${riskClass(p.risk_level)}`}>{p.risk_level}</span></td>
                  <td className="p-3 text-gray-400">{p.created_date}</td><td className="p-3 text-gray-400">{p.created_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reports' && (
        <div className="p-4 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-yellow-500 uppercase text-xs tracking-wide border-b border-yellow-500/20"><th className="p-3 text-left">ID</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Period</th><th className="p-3 text-left">Total</th><th className="p-3 text-left">Accuracy</th><th className="p-3 text-left">Generated</th></tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="p-3">{r.id}</td><td className="p-3 capitalize">{r.type}</td><td className="p-3">{r.start_date} - {r.end_date}</td><td className="p-3">{r.total_predictions}</td><td className="p-3">{r.accuracy}%</td><td className="p-3 text-gray-400 text-xs">{r.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'logs' && (
        <div className="p-4 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 overflow-x-auto max-h-[500px]">
          <table className="w-full text-sm">
            <thead><tr className="text-yellow-500 uppercase text-xs tracking-wide border-b border-yellow-500/20"><th className="p-3 text-left">ID</th><th className="p-3 text-left">User ID</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Details</th><th className="p-3 text-left">Timestamp</th></tr></thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-b border-white/5">
                  <td className="p-3">{l.id}</td><td className="p-3">{l.user_id}</td>
                  <td className="p-3"><code className="text-yellow-500">{l.action}</code></td>
                  <td className="p-3 text-gray-300">{l.details}</td><td className="p-3 text-gray-400 text-xs">{l.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
