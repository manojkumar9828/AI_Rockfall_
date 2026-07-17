import { Phone, Ambulance, FireExtinguisher, Shield, Contact } from 'lucide-react';

export function EmergencyPage() {
  const services = [
    { icon: Ambulance, title: 'Emergency Services', number: '108', desc: 'Ambulance & Rescue' },
    { icon: FireExtinguisher, title: 'Fire Department', number: '101', desc: 'Fire & Rescue' },
    { icon: Shield, title: 'Police', number: '100', desc: 'Law Enforcement' },
  ];
  const team = [
    { role: 'Safety Officer', name: 'R. Sharma', phone: '+91 98765 43210', avail: '24/7' },
    { role: 'Mine Manager', name: 'S. Verma', phone: '+91 98765 43211', avail: '24/7' },
    { role: 'Shift Supervisor', name: 'A. Kumar', phone: '+91 98765 43212', avail: 'Shift-based' },
    { role: 'Medical Officer', name: 'Dr. P. Singh', phone: '+91 98765 43213', avail: '24/7' },
    { role: 'Maintenance Lead', name: 'K. Reddy', phone: '+91 98765 43214', avail: 'Day shift' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><Phone className="text-yellow-500" size={28} /> Emergency Contacts</h1>
        <p className="text-gray-400">Critical contact information for emergency response</p>
      </div>

      <div className="p-5 rounded-xl bg-red-500/15 border-2 border-red-500 text-red-400 text-center text-lg font-bold mb-6">
        <Shield className="inline mr-2" size={24} /> In case of rockfall emergency, evacuate immediately and contact the following
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20 mb-3 mx-auto"><Icon size={24} /></div>
              <h4 className="font-bold text-white">{s.title}</h4>
              <p className="text-4xl font-extrabold text-red-400 my-2">{s.number}</p>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 overflow-x-auto">
        <h5 className="font-bold text-white mb-3 flex items-center gap-2"><Contact className="text-yellow-500" size={18} /> Mine Emergency Team</h5>
        <table className="w-full text-sm">
          <thead><tr className="text-yellow-500 uppercase text-xs tracking-wide border-b border-yellow-500/20"><th className="p-3 text-left">Role</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Phone</th><th className="p-3 text-left">Availability</th></tr></thead>
          <tbody>
            {team.map((t, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="p-3 text-white">{t.role}</td><td className="p-3 text-gray-300">{t.name}</td><td className="p-3 text-yellow-500">{t.phone}</td>
                <td className="p-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.avail === '24/7' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>{t.avail}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
