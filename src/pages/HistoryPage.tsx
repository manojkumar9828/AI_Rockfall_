import { useState } from 'react';
import { History, Search, Trash2, Download } from 'lucide-react';

interface HistoryRecord {
  id: number;
  image_name: string;
  prediction: string;
  confidence: number;
  risk_level: string;
  date: string;
  time: string;
}

const sampleRecords: HistoryRecord[] = [
  { id: 1, image_name: '20260716_135124_test.png', prediction: 'Dangerous', confidence: 70.34, risk_level: 'High', date: '2026-07-16', time: '13:51:24' },
];

export function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>(sampleRecords);
  const [search, setSearch] = useState('');

  const filtered = records.filter(r =>
    r.image_name.toLowerCase().includes(search.toLowerCase()) ||
    r.prediction.toLowerCase().includes(search.toLowerCase()) ||
    r.risk_level.toLowerCase().includes(search.toLowerCase())
  );

  const deleteRecord = (id: number) => {
    if (confirm('Delete this record?')) setRecords(records.filter(r => r.id !== id));
  };

  const exportCSV = () => {
    const headers = ['ID,Image Name,Prediction,Confidence (%),Risk Level,Date,Time'];
    const rows = filtered.map(r => `${r.id},${r.image_name},${r.prediction},${r.confidence},${r.risk_level},${r.date},${r.time}`);
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rockfall_history.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const badgeClass = (pred: string) =>
    pred === 'Safe' ? 'bg-green-500/20 text-green-400' : pred === 'Warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400';
  const riskClass = (risk: string) =>
    risk === 'Low' ? 'bg-green-500/20 text-green-400' : risk === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><History className="text-yellow-500" size={28} /> Alert History</h1>
          <p className="text-gray-400">All prediction records stored in database</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="p-4 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by image name, prediction, or risk level..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500" />
          </div>
          {search && <button onClick={() => setSearch('')} className="px-4 py-2 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">Clear</button>}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-yellow-500 uppercase text-xs tracking-wide border-b border-yellow-500/20">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Image Name</th>
              <th className="p-3 text-left">Prediction</th>
              <th className="p-3 text-left">Confidence</th>
              <th className="p-3 text-left">Risk Level</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-yellow-500/3">
                <td className="p-3">{r.id}</td>
                <td className="p-3 text-gray-300">{r.image_name}</td>
                <td className="p-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass(r.prediction)}`}>{r.prediction}</span></td>
                <td className="p-3 text-white">{r.confidence}%</td>
                <td className="p-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${riskClass(r.risk_level)}`}>{r.risk_level}</span></td>
                <td className="p-3 text-gray-400">{r.date}</td>
                <td className="p-3 text-gray-400">{r.time}</td>
                <td className="p-3">
                  <button onClick={() => deleteRecord(r.id)} className="px-2.5 py-1.5 rounded-lg bg-red-500/15 border border-red-500 text-red-400 hover:bg-red-500/25 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-gray-400">No prediction records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-gray-400 text-sm mt-3">{filtered.length} record(s) found</p>
    </div>
  );
}
