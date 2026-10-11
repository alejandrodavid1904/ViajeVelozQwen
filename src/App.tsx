import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Choferes from './pages/Choferes';
import Viajes from './pages/Viajes';
import { Page } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home />;
      case 'clientes': return <Clientes />;
      case 'choferes': return <Choferes />;
      case 'viajes': return <Viajes />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile container */}
      <div className="max-w-lg mx-auto relative">
        {/* Status bar simulation */}
        <div className="bg-yellow-500 px-4 py-2 flex items-center justify-between text-white text-xs">
          <span className="font-medium">ViajeVeloz</span>
          <span>🚕</span>
        </div>
        
        {/* Page content */}
        <main className="min-h-[calc(100vh-80px)]">
          {renderPage()}
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
