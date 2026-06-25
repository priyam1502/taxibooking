import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

const emptyForm = { code: '', description: '', discountType: 'flat', discountValue: 0, minRideAmount: 0, isActive: true };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = () => adminApi.getCoupons().then(({ data }) => setCoupons(data.coupons));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCoupon(form);
      toast.success('Coupon created');
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleToggle = async (c) => {
    await adminApi.updateCoupon(c._id, { isActive: !c.isActive });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await adminApi.deleteCoupon(id);
    toast.success('Coupon deleted');
    load();
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card overflow-x-auto">
        <h3 className="font-semibold text-gray-800 mb-4">Coupons</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Code</th>
              <th>Discount</th>
              <th>Min Ride</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="py-3 font-medium">{c.code}</td>
                <td>{c.discountType === 'flat' ? `₹${c.discountValue}` : `${c.discountValue}%`}</td>
                <td>₹{c.minRideAmount}</td>
                <td>
                  <button onClick={() => handleToggle(c)} className={`text-xs font-semibold px-2 py-1 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(c._id)}><Trash2 size={16} className="text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Create Coupon</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input-field" placeholder="Coupon Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <input className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input-field" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
            <option value="flat">Flat Discount (₹)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
          <input type="number" className="input-field" placeholder="Discount Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} />
          <input type="number" className="input-field" placeholder="Min Ride Amount" value={form.minRideAmount} onChange={(e) => setForm({ ...form, minRideAmount: Number(e.target.value) })} />
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={16} /> Create Coupon
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCoupons;
