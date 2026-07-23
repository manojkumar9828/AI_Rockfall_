import { Shield, Bell, Database, FileText, ShieldCheck, UploadCloud, Brain, AlertTriangle, Target, Users, HardHat, Mail, Phone, MapPin } from 'lucide-react';
import type { Page } from '../store.tsx';

export function HomePage({ navigate, isLoggedIn }: { navigate: (p: Page) => void; isLoggedIn: boolean }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.pexels.com/photos/2086361/pexels-photo-2086361.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
        <div className="relative z-10 px-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500 text-yellow-500 text-sm font-semibold mb-6 animate-fadeIn">
            <HardHat size={16} /> Industrial AI Monitoring
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-fadeIn">
            AI-Based <span className="text-yellow-500">Rockfall Prediction</span><br />& Alert System
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8 animate-fadeIn">
            Deep learning powered rockfall detection for open pit mines. Upload slope images and get instant risk classification with automated evacuation alerts.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate(isLoggedIn ? 'upload' : 'login')} className="px-6 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:translate-y-[-2px] transition-transform shadow-lg">
              {isLoggedIn ? 'Start Detection' : 'Get Started'}
            </button>
            <button onClick={() => navigate('documentation')} className="px-6 py-3 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="About The" highlight="Project" subtitle="Protecting miners through artificial intelligence" />
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="md:col-span-2 p-8 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Project Overview</h3>
              <p className="text-gray-400 mb-3">Rockfall is one of the most critical hazards in open pit mining, responsible for equipment damage, production delays, and fatal accidents. Traditional monitoring relies on visual inspection by geotechnical engineers, which is subjective, slow, and limited by human availability.</p>
              <p className="text-gray-400">This project develops an AI-powered system using a Convolutional Neural Network (CNN) trained on mine slope images to classify rock conditions into <span className="text-green-400 font-semibold">Safe</span>, <span className="text-orange-500 font-semibold">Warning</span>, and <span className="text-red-400 font-semibold">Dangerous</span> categories.</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-4">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Technology</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> TensorFlow CNN Model</li>
                <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> React + Vite Frontend</li>
                <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> Flask API Backend</li>
                <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> Chart.js Analytics</li>
                <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> SQLite Database</li>
                <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> OpenCV Processing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Project" highlight="Objectives" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              { icon: Target, title: 'Early Detection', desc: 'Detect unstable rock formations before rockfall occurs using CNN image classification.' },
              { icon: Bell, title: 'Instant Alerts', desc: 'Generate automatic evacuation alerts when dangerous conditions are identified.' },
              { icon: FileText, title: 'Data Analytics', desc: 'Maintain prediction history and generate visual reports for safety analysis.' },
              { icon: Users, title: 'User Management', desc: 'Role-based access for administrators and field operators with secure sessions.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 hover:translate-y-[-4px] hover:border-yellow-500/40 transition-all">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-3 mx-auto">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm text-center">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Key" highlight="Features" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[
              { icon: UploadCloud, title: 'Image Upload', desc: 'Upload JPG, JPEG, or PNG images of mine slopes with instant preview.' },
              { icon: Brain, title: 'AI Prediction', desc: 'CNN model classifies images into Safe, Warning, or Dangerous with confidence scores.' },
              { icon: AlertTriangle, title: 'Alert System', desc: 'Color-coded alerts: red for evacuation, orange for warning, green for safe.' },
              { icon: Database, title: 'Alert History', desc: 'Every prediction is stored with search, delete, and CSV export capabilities.' },
              { icon: FileText, title: 'Reports', desc: 'Generate daily, weekly, and monthly reports with charts and accuracy metrics.' },
              { icon: ShieldCheck, title: 'Admin Panel', desc: 'Manage users, view prediction history, monitor system logs, and reports.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 hover:translate-y-[-4px] hover:border-yellow-500/40 transition-all">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-3">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Project" highlight="Team" subtitle="The engineers behind RockGuard AI" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              { name: 'Student One', role: 'ML Engineer', desc: 'CNN architecture, model training, and prediction pipeline.', avatar: 'A' },
              { name: 'Student Two', role: 'Full Stack Developer', desc: 'Backend, database design, API integration.', avatar: 'B' },
              { name: 'Student Three', role: 'UI/UX Designer', desc: 'Frontend design, responsive layout, UX optimization.', avatar: 'C' },
              { name: 'Student Four', role: 'Data Engineer', desc: 'Dataset collection, preprocessing, augmentation.', avatar: 'D' },
            ].map((member, i) => (
              <div key={i} className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-extrabold text-black bg-gradient-to-br from-yellow-500 to-orange-600 border-2 border-yellow-500/30">
                  {member.avatar}
                </div>
                <h4 className="text-white font-bold">{member.name}</h4>
                <p className="text-yellow-500 text-sm font-semibold">{member.role}</p>
                <p className="text-gray-400 text-xs mt-2">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="Contact" highlight="Us" subtitle="Get in touch for collaboration or inquiries" />
          <div className="p-8 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mt-8">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-3 mx-auto">
                  <Mail size={22} />
                </div>
                <h5 className="text-white font-bold mb-1">Email</h5>
                <p className="text-gray-400 text-sm">team@rockguard.ai</p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-3 mx-auto">
                  <Phone size={22} />
                </div>
                <h5 className="text-white font-bold mb-1">Phone</h5>
                <p className="text-gray-400 text-sm">+91 98765 43210</p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-3 mx-auto">
                  <MapPin size={22} />
                </div>
                <h5 className="text-white font-bold mb-1">Location</h5>
                <p className="text-gray-400 text-sm">Dept. of Computer Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function SectionTitle({ title, highlight, subtitle }: { title: string; highlight: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-white mb-2">{title} <span className="text-yellow-500">{highlight}</span></h2>
      <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-600 mx-auto rounded-full" />
      {subtitle && <p className="text-gray-400 mt-3">{subtitle}</p>}
    </div>
  );
}
