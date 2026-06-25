import { useState } from 'react';
import toast from 'react-hot-toast';
import { cmsApi } from '../../api/rideApi';
import { adminApi } from '../../api/adminApi';

const cmsKeys = ['about_us', 'privacy_policy', 'terms_conditions', 'faq'];

const AdminCms = () => {
  const [key, setKey] = useState('about_us');
  const [content, setContent] = useState({ title: '', content: '' });
  const [banner, setBanner] = useState({ title: '', subtitle: '', image: '', link: '' });

  const loadPage = (k) => {
    setKey(k);
    cmsApi.getPage(k).then(({ data }) => setContent({ title: data.cms.title, content: data.cms.content })).catch(() => setContent({ title: '', content: '' }));
  };

  const handleSaveCms = async (e) => {
    e.preventDefault();
    try {
      await adminApi.upsertCms(key, content);
      toast.success('Page updated');
    } catch (err) {
      toast.error('Failed to save page');
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createBanner(banner);
      toast.success('Banner created');
      setBanner({ title: '', subtitle: '', image: '', link: '' });
    } catch (err) {
      toast.error('Failed to create banner');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3">CMS Pages</h3>
        <div className="flex gap-2 mb-4">
          {cmsKeys.map((k) => (
            <button key={k} onClick={() => loadPage(k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${key === k ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {k.replace('_', ' ')}
            </button>
          ))}
        </div>
        <form onSubmit={handleSaveCms} className="space-y-3">
          <input className="input-field" placeholder="Page Title" value={content.title} onChange={(e) => setContent({ ...content, title: e.target.value })} />
          <textarea className="input-field" rows={8} placeholder="HTML content..." value={content.content} onChange={(e) => setContent({ ...content, content: e.target.value })} />
          <button type="submit" className="btn-primary w-full">Save Page</button>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3">Homepage Banner</h3>
        <form onSubmit={handleCreateBanner} className="space-y-3">
          <input className="input-field" placeholder="Title" value={banner.title} onChange={(e) => setBanner({ ...banner, title: e.target.value })} required />
          <input className="input-field" placeholder="Subtitle" value={banner.subtitle} onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })} />
          <input className="input-field" placeholder="Image URL" value={banner.image} onChange={(e) => setBanner({ ...banner, image: e.target.value })} required />
          <input className="input-field" placeholder="Link (optional)" value={banner.link} onChange={(e) => setBanner({ ...banner, link: e.target.value })} />
          <button type="submit" className="btn-primary w-full">Create Banner</button>
        </form>
      </div>
    </div>
  );
};

export default AdminCms;
