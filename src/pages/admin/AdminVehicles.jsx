import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

const emptyForm = { name: '', baseFare: 0, perKmRate: 0, perMinuteRate: 0, airportCharge: 0, nightChargeMultiplier: 1.2, capacity: 4 };

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = () => adminApi.getVehicles().then(({ data }) => setVehicles(data.vehicles));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminApi.updateVehicle(editingId, form);
        toast.success('Vehicle type updated');
      } else {
        await adminApi.createVehicle(form);
        toast.success('Vehicle type created');
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const handleEdit = (v) => {
    setForm(v);
    setEditingId(v._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vehicle type?')) return;
    await adminApi.deleteVehicle(id);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card overflow-x-auto">
        <h3 className="font-semibold text-gray-800 mb-4">Vehicle Types & Fares</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Name</th>
              <th>Base Fare</th>
              <th>Per KM</th>
              <th>Per Min</th>
              <th>Airport</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id} className="border-b last:border-0">
                <td className="py-3 font-medium">{v.name}</td>
                <td>₹{v.baseFare}</td>
                <td>₹{v.perKmRate}</td>
                <td>₹{v.perMinuteRate}</td>
                <td>₹{v.airportCharge}</td>
                <td>{v.isActive ? 'Yes' : 'No'}</td>
                <td className="space-x-2">
                  <button onClick={() => handleEdit(v)} className="text-xs font-semibold text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(v._id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">{editingId ? 'Edit' : 'Add'} Vehicle Type</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input-field" placeholder="Name (e.g. Mini)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="number" className="input-field" placeholder="Base Fare" value={form.baseFare} onChange={(e) => setForm({ ...form, baseFare: Number(e.target.value) })} />
          <input type="number" className="input-field" placeholder="Per KM Rate" value={form.perKmRate} onChange={(e) => setForm({ ...form, perKmRate: Number(e.target.value) })} />
          <input type="number" className="input-field" placeholder="Per Minute Rate" value={form.perMinuteRate} onChange={(e) => setForm({ ...form, perMinuteRate: Number(e.target.value) })} />
          <input type="number" className="input-field" placeholder="Airport Charge" value={form.airportCharge} onChange={(e) => setForm({ ...form, airportCharge: Number(e.target.value) })} />
          <input type="number" step="0.1" className="input-field" placeholder="Night Charge Multiplier" value={form.nightChargeMultiplier} onChange={(e) => setForm({ ...form, nightChargeMultiplier: Number(e.target.value) })} />
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={16} /> {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }} className="w-full text-sm text-gray-500">
              Cancel Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminVehicles;
