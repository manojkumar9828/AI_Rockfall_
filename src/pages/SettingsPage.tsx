import { useState } from 'react';
import { Settings, Save, Mail, MessageSquare, Video, MapPin } from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState({ threshold: '70', sensitivity: 'medium', theme: 'dark' });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const features = [
    { icon: Mail, title: 'Email Alerts', desc: 'Send alerts to registered emails' },
    { icon: MessageSquare, title: 'SMS Alerts', desc: 'SMS notification placeholder' },
    { icon: Video, title: 'Live Camera', desc: 'Real-time camera detection' },
    { icon: MapPin, title: 'GPS Location', desc: 'Geolocation tagging' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><Settings className="text-yellow-500" size={28} /> Settings</h1>
        <p className="text-gray-400">Configure prediction thresholds and alert sensitivity</p>
      </div>

      <div className="p-8 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Confidence Threshold (%)</label>
            <input type="number" min="0" max="100" step="0.1" value={settings.threshold} onChange={e => setSettings({ ...settings, threshold: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500" />
            <p className="text-xs text-gray-400 mt-1">Predictions below this confidence will be flagged for review.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Alert Sensitivity</label>
            <select value={settings.sensitivity} onChange={e => setSettings({ ...settings, sensitivity: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500">
              <option value="low">Low — Fewer alerts</option>
              <option value="medium">Medium — Balanced</option>
              <option value="high">High — More alerts</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Theme</label>
            <select value={settings.theme} onChange={e => setSettings({ ...settings, theme: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500">
              <option value="dark">Dark Mining (Default)</option>
              <option value="midnight">Midnight</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-6 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:translate-y-[-2px] transition-transform flex items-center gap-2"><Save size={18} /> Save Settings</button>
            {saved && <span className="text-green-400 text-sm">Settings saved!</span>}
          </div>
        </form>
      </div>

      <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mt-6">
        <h5 className="font-bold text-white mb-3 flex items-center gap-2"><Settings className="text-yellow-500" size={18} /> Additional Features (Placeholders)</h5>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                <Icon size={24} className="text-yellow-500" />
                <div><strong className="text-white">{f.title}</strong><p className="text-gray-400 text-xs">{f.desc}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
