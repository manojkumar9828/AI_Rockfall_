import { useState, useEffect, useRef } from 'react';
import { Upload, Brain, Tag, Bell } from 'lucide-react';
import type { PredictionResult } from '../store.tsx';

// Simulated CNN prediction — generates a realistic result
function simulatePrediction(): Omit<PredictionResult, 'filename' | 'imageUrl'> {
  const classes = ['Safe', 'Warning', 'Dangerous'];
  const riskMap: Record<string, string> = { Safe: 'Low', Warning: 'Medium', Dangerous: 'High' };
  const alertMap: Record<string, { type: string; msg: string }> = {
    Dangerous: { type: 'danger', msg: 'Immediate evacuation required.' },
    Warning: { type: 'warning', msg: 'Possible rockfall detected.' },
    Safe: { type: 'safe', msg: 'No immediate risk detected.' },
  };

  // Generate random probabilities
  const raw = classes.map(() => Math.random());
  const sum = raw.reduce((a, b) => a + b, 0);
  const probs = raw.map(v => v / sum);
  const idx = probs.indexOf(Math.max(...probs));
  const class_name = classes[idx];
  const confidence = Math.round(probs[idx] * 10000) / 100;
  const all_probabilities: Record<string, number> = {};
  classes.forEach((c, i) => { all_probabilities[c] = Math.round(probs[i] * 10000) / 100; });

  return {
    class_name,
    confidence,
    risk_level: riskMap[class_name],
    prediction_time: Math.round((Math.random() * 0.15 + 0.05) * 10000) / 10000,
    all_probabilities,
    alert_type: alertMap[class_name].type,
    alert_message: alertMap[class_name].msg,
  };
}

export function UploadPage({ setPrediction }: { setPrediction: (p: PredictionResult) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(f.type)) {
      alert('Invalid file type. Allowed: JPG, JPEG, PNG');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  };

  const analyze = () => {
    if (!file) return;
    setAnalyzing(true);
    setTimeout(() => {
      const result = simulatePrediction();
      setPrediction({
        ...result,
        filename: file.name,
        imageUrl: preview,
      });
      setAnalyzing(false);
    }, 1500);
  };

  const reset = () => {
    setFile(null);
    setPreview('');
    if (inputRef.current) inputRef.current.value = '';
  };

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><Upload className="text-yellow-500" size={28} /> Image Upload</h1>
        <p className="text-gray-400">Upload a mine slope image for AI-powered rockfall risk analysis</p>
      </div>

      <div className="p-8 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15">
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-yellow-500 bg-yellow-500/5' : 'border-yellow-500/30 hover:border-yellow-500/50'}`}
        >
          <Upload size={48} className="text-yellow-500 mx-auto mb-3" />
          <h4 className="text-white text-lg mb-1">Drop image here or click to browse</h4>
          <p className="text-gray-400 text-sm">Supported formats: JPG, JPEG, PNG (max 16MB)</p>
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {preview && (
          <div className="mt-6 text-center">
            <img src={preview} alt="Preview" className="max-h-72 mx-auto rounded-xl border border-yellow-500/20" />
            <p className="text-gray-400 mt-2 text-sm">{file?.name}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={analyze} disabled={!file || analyzing} className="px-6 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px] transition-all flex items-center gap-2">
            {analyzing ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Analyzing...</> : <><Brain size={18} /> Analyze Image</>}
          </button>
          <button onClick={reset} className="px-6 py-3 rounded-lg font-semibold text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
            Reset
          </button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mt-6">
        <h5 className="font-bold text-white mb-3">How It Works</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Upload, label: '1. Upload slope image' },
            { icon: Brain, label: '2. CNN model analyzes' },
            { icon: Tag, label: '3. Classification result' },
            { icon: Bell, label: '4. Alert generated' },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-2 mx-auto">
                  <Icon size={18} />
                </div>
                <p className="text-gray-400 text-xs">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
