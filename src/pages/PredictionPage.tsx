import { CheckCircle, AlertTriangle, XCircle, FileText, Brain } from 'lucide-react';
import type { PredictionResult, Page } from '../store.tsx';

export function PredictionPage({ result, navigate }: { result: PredictionResult; navigate: (p: Page) => void }) {
  const alertColors: Record<string, string> = {
    danger: 'bg-red-500/15 border-red-500 text-red-400',
    warning: 'bg-orange-500/15 border-orange-500 text-orange-400',
    safe: 'bg-green-500/15 border-green-500 text-green-400',
  };
  const alertIcons: Record<string, typeof CheckCircle> = {
    danger: XCircle,
    warning: AlertTriangle,
    safe: CheckCircle,
  };
  const AlertIcon = alertIcons[result.alert_type];

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><Brain className="text-yellow-500" size={28} /> AI Prediction Result</h1>
        <p className="text-gray-400">CNN model analysis and risk assessment</p>
      </div>

      {/* Alert Banner */}
      <div className={`p-5 rounded-xl border-2 text-center text-lg font-bold mb-6 animate-pulse-slow ${alertColors[result.alert_type]}`}>
        <AlertIcon className="inline mr-2" size={24} />
        {result.alert_type === 'danger' ? 'RED ALERT' : result.alert_type === 'warning' ? 'WARNING' : 'SAFE'} — {result.alert_message}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
          <h5 className="font-bold text-white mb-3 flex items-center gap-2"><FileText className="text-yellow-500" size={18} /> Uploaded Image</h5>
          <img src={result.imageUrl} alt="Uploaded" className="w-full rounded-xl border border-yellow-500/20" />
        </div>

        {/* Details */}
        <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
          <h5 className="font-bold text-white mb-4 flex items-center gap-2"><FileText className="text-yellow-500" size={18} /> Prediction Details</h5>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Prediction Class</label>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
              result.class_name === 'Safe' ? 'bg-green-500/20 text-green-400' :
              result.class_name === 'Warning' ? 'bg-orange-500/20 text-orange-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {result.class_name === 'Dangerous' ? <XCircle size={16} /> : result.class_name === 'Warning' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
              {result.class_name}
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Confidence Score</label>
            <div className="flex justify-between mb-1">
              <span className="text-white font-bold">{result.confidence}%</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Risk Level</label>
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
              result.risk_level === 'Low' ? 'bg-green-500/20 text-green-400' :
              result.risk_level === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
              'bg-red-500/20 text-red-400'
            }`}>{result.risk_level}</span>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Prediction Time</label>
            <p className="text-white">{result.prediction_time} seconds</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">All Class Probabilities</label>
            {Object.entries(result.all_probabilities).map(([cls, prob]) => (
              <div key={cls} className="mb-2">
                <div className="flex justify-between text-sm mb-0.5">
                  <span>{cls}</span><span>{prob}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full transition-all duration-1000" style={{ width: `${prob}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <button onClick={() => navigate('upload')} className="py-3 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:translate-y-[-2px] transition-transform flex items-center justify-center gap-2"><FileText size={18} /> New Upload</button>
        <button onClick={() => navigate('dashboard')} className="py-3 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">Dashboard</button>
        <button onClick={() => navigate('history')} className="py-3 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">History</button>
        <button onClick={() => window.print()} className="py-3 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">Download PDF</button>
      </div>
    </div>
  );
}
