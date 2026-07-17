import { Shield, CloudSun, MapPin, HardHat, Video, CheckCircle } from 'lucide-react';

export function MineInfoPage() {
  const info = [
    ['Mine Name', 'Greenfield Open Pit Mine'], ['Location', 'Chhattisgarh, India'], ['Type', 'Open Pit / Surface Mine'],
    ['Commodity', 'Iron Ore'], ['Operating Depth', '180 meters'], ['Slope Angle', '45-55 degrees'],
    ['Daily Production', '8,000 tonnes'], ['Workforce', '450 personnel'], ['Monitoring System', 'RockGuard AI (CNN-based)'],
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><Shield className="text-yellow-500" size={28} /> Mine Information</h1>
        <p className="text-gray-400">Open pit mine details and monitoring context</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
          <h4 className="font-bold text-white mb-3">Site Overview</h4>
          <table className="w-full text-sm">
            <tbody>
              {info.map(([key, val], i) => (
                <tr key={i} className="border-b border-white/5"><th className="p-3 text-left text-gray-400 w-40">{key}</th><td className="p-3 text-white">{val}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
            <CloudSun size={24} className="text-yellow-500 mb-2" />
            <h5 className="font-bold text-white mb-2">Weather Information</h5>
            <p className="text-gray-400 text-xs mb-3">Placeholder for live weather data integration</p>
            {[['Temperature', '32°C'], ['Humidity', '68%'], ['Wind Speed', '12 km/h'], ['Rainfall', '0 mm']].map(([k, v], i) => (
              <div key={i} className="flex justify-between mb-1.5"><span className="text-gray-400">{k}</span><span className="font-bold text-white">{v}</span></div>
            ))}
          </div>
          <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
            <MapPin size={24} className="text-yellow-500 mb-2" />
            <h5 className="font-bold text-white mb-2">GPS Location</h5>
            <p className="text-gray-400 text-xs mb-2">Placeholder for geolocation</p>
            <p className="flex items-center gap-1.5"><MapPin size={14} className="text-yellow-500" /> 21.2514° N, 81.6296° E</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
          <h5 className="font-bold text-white mb-3 flex items-center gap-2"><HardHat className="text-yellow-500" size={18} /> Safety Protocols</h5>
          <ul className="space-y-2">
            {['Daily geotechnical inspection', 'AI-based slope monitoring every 4 hours', 'Mandatory PPE for all personnel', 'Evacuation drills monthly', 'Automated alert dispatch on danger detection'].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-300"><CheckCircle size={16} className="text-yellow-500" /> {item}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
          <h5 className="font-bold text-white mb-3 flex items-center gap-2"><Video className="text-yellow-500" size={18} /> Live Camera Detection</h5>
          <p className="text-gray-400 text-xs mb-3">Placeholder for real-time camera feed integration</p>
          <div className="bg-black/40 rounded-lg h-36 flex items-center justify-center border border-dashed border-yellow-500/20">
            <Video size={32} className="text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
