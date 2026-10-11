import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cliente, Chofer, Viaje } from '../types';

interface AppContextType {
  clientes: Cliente[];
  choferes: Chofer[];
  viajes: Viaje[];
  tarifaKm: number;
  addCliente: (cliente: Cliente) => void;
  updateCliente: (cliente: Cliente) => void;
  deleteCliente: (id: string) => void;
  addChofer: (chofer: Chofer) => void;
  updateChofer: (chofer: Chofer) => void;
  deleteChofer: (id: string) => void;
  addViaje: (viaje: Viaje) => void;
  updateViaje: (viaje: Viaje) => void;
  deleteViaje: (id: string) => void;
  setTarifaKm: (tarifa: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(() => loadFromStorage('vv_clientes', []));
  const [choferes, setChoferes] = useState<Chofer[]>(() => loadFromStorage('vv_choferes', []));
  const [viajes, setViajes] = useState<Viaje[]>(() => loadFromStorage('vv_viajes', []));
  const [tarifaKm, setTarifaKm] = useState<number>(() => loadFromStorage('vv_tarifa', 1.5));

  useEffect(() => { localStorage.setItem('vv_clientes', JSON.stringify(clientes)); }, [clientes]);
  useEffect(() => { localStorage.setItem('vv_choferes', JSON.stringify(choferes)); }, [choferes]);
  useEffect(() => { localStorage.setItem('vv_viajes', JSON.stringify(viajes)); }, [viajes]);
  useEffect(() => { localStorage.setItem('vv_tarifa', JSON.stringify(tarifaKm)); }, [tarifaKm]);

  const addCliente = (c: Cliente) => setClientes(prev => [...prev, c]);
  const updateCliente = (c: Cliente) => setClientes(prev => prev.map(x => x.id === c.id ? c : x));
  const deleteCliente = (id: string) => setClientes(prev => prev.filter(x => x.id !== id));

  const addChofer = (c: Chofer) => setChoferes(prev => [...prev, c]);
  const updateChofer = (c: Chofer) => setChoferes(prev => prev.map(x => x.id === c.id ? c : x));
  const deleteChofer = (id: string) => setChoferes(prev => prev.filter(x => x.id !== id));

  const addViaje = (v: Viaje) => setViajes(prev => [...prev, v]);
  const updateViaje = (v: Viaje) => setViajes(prev => prev.map(x => x.id === v.id ? v : x));
  const deleteViaje = (id: string) => setViajes(prev => prev.filter(x => x.id !== id));

  return (
    <AppContext.Provider value={{
      clientes, choferes, viajes, tarifaKm,
      addCliente, updateCliente, deleteCliente,
      addChofer, updateChofer, deleteChofer,
      addViaje, updateViaje, deleteViaje,
      setTarifaKm
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
