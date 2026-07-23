import { useApp, Navbar, Footer } from './store.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { UploadPage } from './pages/UploadPage.tsx';
import { PredictionPage } from './pages/PredictionPage.tsx';
import { HistoryPage } from './pages/HistoryPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { MineInfoPage } from './pages/MineInfoPage.tsx';
import { EmergencyPage } from './pages/EmergencyPage.tsx';
import { DocumentationPage } from './pages/DocumentationPage.tsx';

function App() {
  const { state, navigate, login, logout, setPrediction } = useApp();
  const { currentPage, user, lastPrediction } = state;

  const authPages = ['dashboard', 'upload', 'prediction', 'history', 'reports', 'settings', 'admin'];
  if (authPages.includes(currentPage) && !user) {
    return (
      <div>
        <Navbar state={state} navigate={navigate} logout={logout} />
        <LoginPage login={login} />
        <Footer />
      </div>
    );
  }

  if (currentPage === 'admin' && user?.role !== 'admin') {
    return (
      <div>
        <Navbar state={state} navigate={navigate} logout={logout} />
        <div className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-extrabold text-red-400">403 — Access Forbidden</h1>
          <p className="text-gray-400 mt-2">Admin privileges required.</p>
          <button onClick={() => navigate('dashboard')} className="mt-4 px-6 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600">Back to Dashboard</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar state={state} navigate={navigate} logout={logout} />
      <main className="flex-1">
        {currentPage === 'home' && <HomePage navigate={navigate} isLoggedIn={!!user} />}
        {currentPage === 'login' && (user ? <DashboardPage navigate={navigate} /> : <LoginPage login={login} />)}
        {currentPage === 'dashboard' && <DashboardPage navigate={navigate} />}
        {currentPage === 'upload' && <UploadPage setPrediction={setPrediction} />}
        {currentPage === 'prediction' && lastPrediction && <PredictionPage result={lastPrediction} navigate={navigate} />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'reports' && <ReportsPage />}
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'admin' && <AdminPage />}
        {currentPage === 'mine-info' && <MineInfoPage />}
        {currentPage === 'emergency' && <EmergencyPage />}
        {currentPage === 'documentation' && <DocumentationPage />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
