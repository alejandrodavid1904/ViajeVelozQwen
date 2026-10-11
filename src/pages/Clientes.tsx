import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cliente } from '../types';

export default function Clientes() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    nombre: '', apellidos: '', identificacion: '', numeroMovil: '', foto: ''
  });
  const [error, setError] = useState('');

  const filtered = clientes.filter(c =>
    `${c.nombre} ${c.apellidos} ${c.identificacion}`.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm({ nombre: '', apellidos: '', identificacion: '', numeroMovil: '', foto: '' });
    setEditing(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (c: Cliente) => {
    setForm({ nombre: c.nombre, apellidos: c.apellidos, identificacion: c.identificacion, numeroMovil: c.numeroMovil, foto: c.foto || '' });
    setEditing(c);
    setError('');
    setShowForm(true);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(f => ({ ...f, foto: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identificacion.trim()) {
      setError('El ID es obligatorio');
      return;
    }
    if (!form.nombre.trim() || !form.apellidos.trim()) {
      setError('Nombre y apellidos son obligatorios');
      return;
    }

    if (editing) {
      updateCliente({ ...editing, ...form, foto: form.foto || null });
    } else {
      addCliente({
        id: Date.now().toString(),
        nombre: form.nombre,
        apellidos: form.apellidos,
        identificacion: form.identificacion,
        numeroMovil: form.numeroMovil,
        foto: form.foto || null
      });
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este cliente?')) {
      deleteCliente(id);
    }
  };

  if (showForm) {
    return (
      <div className="p-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{editing ? 'Editar' : 'Nuevo'} Cliente</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              placeholder="Nombre del cliente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
            <input
              type="text"
              value={form.apellidos}
              onChange={e => setForm(f => ({ ...f, apellidos: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              placeholder="Apellidos del cliente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID (Obligatorio) *</label>
            <input
              type="text"
              value={form.identificacion}
              onChange={e => setForm(f => ({ ...f, identificacion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              placeholder="Número de identificación"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Móvil</label>
            <input
              type="tel"
              value={form.numeroMovil}
              onChange={e => setForm(f => ({ ...f, numeroMovil: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              placeholder="+53 5555-5555"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto (Opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
            />
            {form.foto && (
              <img src={form.foto} alt="Preview" className="mt-2 w-20 h-20 rounded-lg object-cover" />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
          >
            {editing ? 'Actualizar' : 'Guardar'} Cliente
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Clientes</h2>
        <button onClick={openNew} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-1">
          <span>+</span> Nuevo
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm"
        />
        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl">👥</span>
          <p className="text-gray-400 mt-2 text-sm">No hay clientes registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              {c.foto ? (
                <img src={c.foto} alt={c.nombre} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{c.nombre} {c.apellidos}</p>
                <p className="text-xs text-gray-500">ID: {c.identificacion}</p>
                <p className="text-xs text-gray-400">{c.numeroMovil}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
