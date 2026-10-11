import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const items: { page: Page; icon: string; label: string }[] = [
    { page: 'home', icon: '🏠', label: 'Inicio' },
    { page: 'clientes', icon: '👥', label: 'Clientes' },
    { page: 'choferes', icon: '🚗', label: 'Choferes' },
    { page: 'viajes', icon: '🛣️', label: 'Viajes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {items.map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              currentPage === item.page
                ? 'text-yellow-600 bg-yellow-50 scale-105'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
