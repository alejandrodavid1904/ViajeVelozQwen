import { useApp } from '../context/AppContext';

export default function Home() {
  const { clientes, choferes, viajes, tarifaKm, setTarifaKm } = useApp();

  const totalIngresos = viajes.reduce((acc, v) => acc + v.costoTotal, 0);
  const totalPorcentaje = viajes.reduce((acc, v) => acc + v.porcentaje, 0);
  const viajesHoy = viajes.filter(v => v.fecha === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-5 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-2xl">🚕</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ViajeVeloz</h1>
            <p className="text-sm text-gray-700">Panel de Control</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">Gestiona tu agencia de taxis de forma eficiente</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">👥</span>
            <span className="text-xs text-gray-500 font-medium">CLIENTES</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🚗</span>
            <span className="text-xs text-gray-500 font-medium">CHOFERES</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{choferes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🛣️</span>
            <span className="text-xs text-gray-500 font-medium">VIAJES</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{viajes.length}</p>
          <p className="text-xs text-gray-400">{viajesHoy} hoy</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💰</span>
            <span className="text-xs text-gray-500 font-medium">INGRESOS</span>
          </div>
          <p className="text-2xl font-bold text-green-600">${totalIngresos.toFixed(2)}</p>
        </div>
      </div>

      {/* Porcentaje ganado */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 mb-6 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-green-100 text-xs font-medium">PORCENTAJE GANADO (15%)</p>
            <p className="text-2xl font-bold text-white mt-1">${totalPorcentaje.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">📈</span>
          </div>
        </div>
      </div>

      {/* Tarifa */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>⚙️</span> Configuración de Tarifa
        </h3>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Tarifa por km:</label>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={tarifaKm}
              onChange={(e) => setTarifaKm(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              step="0.1"
              min="0"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Fórmula: Distancia(km) × 2 × Tarifa/km = Costo Total
        </p>
      </div>

      {/* Últimos viajes */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📋</span> Últimos Viajes
        </h3>
        {viajes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No hay viajes registrados</p>
        ) : (
          <div className="space-y-2">
            {viajes.slice(-5).reverse().map(v => {
              const cliente = clientes.find(c => c.id === v.clienteId);
              const chofer = choferes.find(c => c.id === v.choferId);
              return (
                <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {cliente?.nombre || 'N/A'} → {v.destino}
                    </p>
                    <p className="text-xs text-gray-400">Chofer: {chofer?.nombre || 'N/A'}</p>
                  </div>
                  <p className="text-sm font-bold text-green-600">${v.costoTotal.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
