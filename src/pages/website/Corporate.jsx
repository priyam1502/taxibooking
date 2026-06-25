import { useState } from 'react';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';

const Corporate = () => {
  const [form, setForm] = useState({ company: '', contactName: '', email: '', mobile: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thanks! Our corporate team will reach out within 24 hours.');
    setForm({ company: '', contactName: '', email: '', mobile: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <Building2 className="mx-auto text-primary-600 mb-3" size={40} />
        <h1 className="text-3xl font-bold text-gray-900">Corporate Ride Booking</h1>
        <p className="text-gray-600 mt-2">Centralized billing, dedicated support, and priority rides for your business.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Company Name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            <input className="input-field" placeholder="Contact Person" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="email" className="input-field" placeholder="Work Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input-field" placeholder="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
          </div>
          <textarea className="input-field" rows={4} placeholder="Tell us about your requirements..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button type="submit" className="btn-primary w-full">Request a Callback</button>
        </form>
      </div>
    </div>
  );
};

export default Corporate;
