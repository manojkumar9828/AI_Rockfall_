import { Book } from 'lucide-react';

export function DocumentationPage() {
  const sections = [
    { id: 'abstract', title: '1. Abstract', content: 'Rockfall hazards in open pit mines pose significant risks to personnel safety, equipment, and productivity. Traditional monitoring methods rely on manual visual inspections, which are subjective and limited in coverage. This project presents an AI-based rockfall prediction and alert system using a Convolutional Neural Network (CNN) to classify mine slope images into Safe, Warning, and Dangerous categories. The system provides real-time alerts, stores prediction history in a database, and generates analytical reports.' },
    { id: 'intro', title: '2. Introduction', content: 'Mining is a critical industry that supplies raw materials for infrastructure, manufacturing, and energy production. Open pit mining is the most common surface mining method, but it exposes workers to rockfall hazards from unstable slope formations. Factors such as weathering, blasting vibrations, and geological discontinuities can trigger sudden rockfalls without warning. Advances in deep learning, particularly CNNs, have made image-based classification a viable approach for geotechnical monitoring.' },
    { id: 'problem', title: '3. Problem Statement', content: 'Existing rockfall monitoring in open pit mines depends on periodic human inspection, which is: subjective and prone to human error; limited by inspector availability and visibility conditions; unable to provide continuous, real-time monitoring; slow to trigger evacuation in critical situations. There is a need for an automated, AI-powered system that can continuously assess slope stability from images and generate instant alerts.' },
    { id: 'objectives', title: '4. Objectives', content: '1. Develop a CNN model to classify mine slope images into Safe, Warning, and Dangerous categories. 2. Build a web-based interface for image upload, prediction, and alert display. 3. Implement an alert system with color-coded risk indicators. 4. Store all predictions in a database with search and export capabilities. 5. Generate daily, weekly, and monthly reports with visual analytics. 6. Provide an admin panel for user and system management.' },
    { id: 'literature', title: '5. Literature Survey', content: 'Research in rockfall prediction has evolved from traditional geotechnical analysis to machine learning approaches. Early systems used sensor-based monitoring (extensometers, piezometers) for displacement measurement. Recent studies apply CNNs to satellite and drone imagery for slope stability assessment. Key references: Wolf et al. (2020) — CNN-based landslide detection; Krizhevsky et al. (2012) — AlexNet; Simonyan & Zisserman (2014) — VGGNet; He et al. (2015) — ResNet.' },
    { id: 'methodology', title: '6. Methodology', content: '1. Data Collection: Mine slope images categorized into Safe, Warning, and Dangerous folders. 2. Preprocessing: Images resized to 224x224, normalized to [0,1] range. 3. Augmentation: Rotation, shifting, flipping, and zoom applied. 4. Model Training: CNN with convolutional blocks, batch normalization, and dropout trained using Adam optimizer. 5. Inference: Uploaded images processed and classified in real time. 6. Alert Generation: Based on prediction class, appropriate alerts are generated and stored.' },
    { id: 'architecture', title: '7. System Architecture', content: 'The system follows a three-tier architecture: Presentation Tier (HTML5, CSS3, Bootstrap 5, Chart.js, Font Awesome); Application Tier (Python Flask with Blueprints, session management); Data Tier (SQLite database: Users, Predictions, Alerts, Reports, SystemLogs); AI Tier (TensorFlow/Keras CNN model). Prediction Flow: Uploaded Image → CNN Model → Prediction → Confidence Score → Risk Level → Alert Generation → Save to Database → Display Dashboard.' },
    { id: 'advantages', title: '9. Advantages', content: 'Real-time AI-powered rockfall risk assessment; Reduces human error and subjective judgment; Automated alert generation for faster evacuation response; Historical data tracking for trend analysis; Web-based, accessible from any device; Scalable to multiple mine sites.' },
    { id: 'applications', title: '10. Applications', content: 'Open pit metal and mineral mines (iron ore, copper, gold); Quarry operations and aggregate mining; Highway and railway rock slope monitoring; Construction site excavation safety; Geological hazard assessment.' },
    { id: 'future', title: '11. Future Scope', content: 'Integration with live CCTV cameras for continuous monitoring; Drone-based image capture for inaccessible slope areas; SMS and email alert integration; IoT sensor fusion (vibration, displacement) with image data; Transfer learning with larger datasets for improved accuracy; Mobile application for field operators.' },
    { id: 'conclusion', title: '12. Conclusion', content: 'The AI-Based Rockfall Prediction and Alert System demonstrates the effective application of deep learning to mine safety. The CNN model successfully classifies slope images into risk categories, enabling proactive hazard management. The web interface provides an intuitive platform for image upload, prediction viewing, history tracking, and report generation. This system has the potential to significantly reduce rockfall-related accidents in open pit mines.' },
    { id: 'references', title: '13. References', content: '1. Krizhevsky et al. (2012). ImageNet classification with deep CNNs. NeurIPS. 2. Simonyan & Zisserman (2014). VGG. arXiv:1409.1556. 3. He et al. (2015). ResNet. arXiv:1512.03385. 4. Wolf et al. (2020). CNN-based landslide detection. Remote Sensing. 5. Abadi et al. (2016). TensorFlow. OSDI. 6. Chollet (2015). Keras. https://keras.io' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2"><Book className="text-yellow-500" size={28} /> Project Documentation</h1>
        <p className="text-gray-400">Complete technical documentation for the AI-Based Rockfall Prediction System</p>
      </div>

      <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mb-6">
        <h5 className="font-bold text-white mb-2">Table of Contents</h5>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {sections.map(s => <a key={s.id} href={`#${s.id}`} className="text-yellow-500 hover:text-orange-400">{s.title}</a>)}
        </div>
      </div>

      {sections.map(s => (
        <div key={s.id} id={s.id} className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mb-4">
          <h4 className="text-yellow-500 font-bold mb-2">{s.title}</h4>
          <p className="text-gray-300 leading-relaxed">{s.content}</p>
        </div>
      ))}

      {/* Diagrams */}
      <div className="p-6 rounded-xl bg-gray-900/60 backdrop-blur border border-yellow-500/15 mb-4">
        <h4 className="text-yellow-500 font-bold mb-3">8. UML & Flow Diagrams</h4>
        <h6 className="text-white font-semibold mt-3 mb-2">Use Case Diagram</h6>
        <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs text-gray-300">{`[Admin] → (Login) → (Manage Users) → (View All Predictions)
         → (View System Logs) → (Generate Reports)
[User]  → (Login) → (Upload Image) → (View Prediction)
         → (View History) → (Export CSV) → (View Dashboard)
         → (Generate Reports) → (Settings)`}</pre>
        <h6 className="text-white font-semibold mt-3 mb-2">Data Flow Diagram (Level 1)</h6>
        <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs text-gray-300">{`[User] → (Image) → [Upload Module] → (Image File) → [CNN Model]
[CNN Model] → (Prediction+Confidence) → [Alert System]
[Alert System] → (Alert Data) → [Database]
[Database] → (Records) → [Dashboard] → (Stats) → [User]`}</pre>
        <h6 className="text-white font-semibold mt-3 mb-2">ER Diagram</h6>
        <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs text-gray-300">{`Users (id, username, email, password_hash, role, created_at)
  ||--< Predictions (id, user_id, image_name, prediction, confidence, risk_level)
           ||--< Alerts (id, prediction_id, alert_type, message)
Reports (id, user_id, report_type, start_date, end_date, stats)
SystemLogs (id, user_id, action, details, created_at)`}</pre>
        <h6 className="text-white font-semibold mt-3 mb-2">Flowchart</h6>
        <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs text-gray-300">{`[Start] → [Login] → [Upload Image] → [Preprocess 224x224]
  → [CNN Prediction] → [Confidence > Threshold?]
    → Yes: [Classify] → [Dangerous?] → [RED ALERT + Evacuation]
                      → [Warning?]  → [ORANGE ALERT]
                      → [Safe?]     → [GREEN]
    → No: [Flag for Review]
  → [Save to Database] → [Update Dashboard] → [End]`}</pre>
      </div>
    </div>
  );
}
