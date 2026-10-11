import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Viaje } from '../types';

export default function Viajes() {
  const { viajes, clientes, choferes, tarifaKm, addViaje, updateViaje, deleteViaje } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Viaje | null>(null);
  const [form, setForm] = useState({
    clienteId: '', choferId: '', lugarRecogida: '', destino: '', distanciaKm: 0
  });
  const [error, setError] = useState('');

  // Cálculo automático
  const distanciaRecorrida = form.distanciaKm * 2;
  const costoTotal = distanciaRecorrida * tarifaKm;
  const porcentaje = costoTotal * 0.15;

  const openNew = () => {
    setForm({ clienteId: '', choferId: '', lugarRecogida: '', destino: '', distanciaKm: 0 });
    setEditing(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (v: Viaje) => {
    setForm({
      clienteId: v.clienteId,
      choferId: v.choferId,
      lugarRecogida: v.lugarRecogida,
      destino: v.destino,
      distanciaKm: v.distanciaKm / 2 // Guardamos la distancia directa
    });
    setEditing(v);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteId) { setError('Seleccione un cliente'); return; }
    if (!form.choferId) { setError('Seleccione un chofer'); return; }
    if (!form.lugarRecogida.trim()) { setError('El lugar de recogida es obligatorio'); return; }
    if (!form.destino.trim()) { setError('El destino es obligatorio'); return; }
    if (form.distanciaKm <= 0) { setError('La distancia debe ser mayor a 0'); return; }

    const viajeData = {
      clienteId: form.clienteId,
      choferId: form.choferId,
      lugarRecogida: form.lugarRecogida,
      destino: form.destino,
      distanciaKm: form.distanciaKm * 2, // Distancia recorrida (ida y vuelta)
      costoTotal: costoTotal,
      porcentaje: porcentaje,
      fecha: new Date().toISOString().split('T')[0]
    };

    if (editing) {
      updateViaje({ ...editing, ...viajeData });
    } else {
      addViaje({ id: Date.now().toString(), ...viajeData });
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este viaje?')) {
      deleteViaje(id);
    }
  };

  if (showForm) {
    return (
      <div className="p-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{editing ? 'Editar' : 'Nuevo'} Viaje</h2>
          <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
            <select
              value={form.clienteId}
              onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} {c.apellidos} (ID: {c.identificacion})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chofer *</label>
            <select
              value={form.choferId}
              onChange={e => setForm(f => ({ ...f, choferId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm"
            >
              <option value="">Seleccionar chofer...</option>
              {choferes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} {c.apellidos} - {c.vehiculo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de Recogida *</label>
            <input type="text" value={form.lugarRecogida}
              onChange={e => setForm(f => ({ ...f, lugarRecogida: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              placeholder="Dirección de recogida" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
            <input type="text" value={form.destino}
              onChange={e => setForm(f => ({ ...f, destino: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              placeholder="Dirección de destino" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distancia inicio a meta (km) *</label>
            <input type="number" value={form.distanciaKm || ''}
              onChange={e => setForm(f => ({ ...f, distanciaKm: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              placeholder="Kilómetros" min="0" step="0.1" />
          </div>

          {/* Cálculo automático */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>🧮</span> Cálculo Automático
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Distancia recogida-destino:</span>
                <span className="font-medium">{form.distanciaKm.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">× 2 (distancia recorrida):</span>
                <span className="font-medium">{distanciaRecorrida.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">× Tarifa (${tarifaKm}/km):</span>
                <span className="font-medium text-green-600">${costoTotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Costo Total:</span>
                  <span className="font-bold text-green-600 text-lg">${costoTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between bg-yellow-50 -mx-2 px-2 py-1 rounded">
                <span className="text-yellow-700 text-xs">Porcentaje (15%):</span>
                <span className="font-semibold text-yellow-700">${porcentaje.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all">
            {editing ? 'Actualizar' : 'Registrar'} Viaje
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Viajes</h2>
        <button onClick={openNew} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-1">
          <span>+</span> Nuevo
        </button>
      </div>

      {clientes.length === 0 || choferes.length === 0 ? (
        <div className="text-center py-8 bg-yellow-50 rounded-xl border border-yellow-200">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm text-yellow-700 mt-2">
            {clientes.length === 0 && choferes.length === 0
              ? 'Registre al menos un cliente y un chofer para crear viajes'
              : clientes.length === 0
                ? 'Registre al menos un cliente para crear viajes'
                : 'Registre al menos un chofer para crear viajes'
            }
          </p>
        </div>
      ) : viajes.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl">🛣️</span>
          <p className="text-gray-400 mt-2 text-sm">No hay viajes registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...viajes].reverse().map(v => {
            const cliente = clientes.find(c => c.id === v.clienteId);
            const chofer = choferes.find(c => c.id === v.choferId);
            return (
              <div key={v.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {cliente?.nombre || 'N/A'}
                      </span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {v.destino}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      📍 {v.lugarRecogida}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${v.costoTotal.toFixed(2)}</p>
                    <p className="text-xs text-yellow-600">15%: ${v.porcentaje.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-2 mt-2">
                  <span>🧑‍✈️ {chofer?.nombre || 'N/A'} {chofer?.vehiculo || ''}</span>
                  <span>{v.distanciaKm} km recorridos</span>
                  <span>{v.fecha}</span>
                </div>
                <div className="flex gap-1 mt-2 justify-end">
                  <button onClick={() => openEdit(v)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
