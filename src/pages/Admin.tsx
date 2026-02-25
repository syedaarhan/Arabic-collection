import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { LogOut, Plus, Image as ImageIcon, List, Trash2, Edit, Save, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AdminLogin({ setToken }: { setToken: (t: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/login?t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log('Login Response:', res.status, data);

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
      } else {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login Fetch Error:', err);
      // Background diagnostic check
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          setError('Server is active but login is blocked. Check Supabase keys.');
        } else {
          setError('API server is offline (Status: ' + healthRes.status + ').');
        }
      } catch (diagErr) {
        setError('Network error: Server is not responding. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg pt-24 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-px bg-brand-gold/50 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-brand-ink mb-2">Security Portal</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-medium">Arabic Collection Admin</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 text-xs text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-brand-muted/60 mb-2 ml-1">Identity</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-black/10 p-4 text-sm text-brand-ink focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold/50 transition-all outline-none rounded-sm"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-brand-muted/60 mb-2 ml-1">Access Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-black/10 p-4 text-sm text-brand-ink focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold/50 transition-all outline-none rounded-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-brand-ink text-white py-4 font-medium uppercase tracking-[0.2em] text-[10px] hover:bg-brand-gold transition-all duration-300 active:scale-[0.98] rounded-sm flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing...</span>
              </>
            ) : 'Authorize Entry'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row pt-24">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-brand-ink text-white p-8 flex flex-col md:min-h-[calc(100vh-4rem)]">
        <div className="mb-10">
          <h2 className="text-xl font-serif tracking-widest">CONSOLE</h2>
          <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] mt-1 font-medium">Boutique Management</p>
        </div>

        <nav className="space-y-1 flex-grow">
          <SidebarLink to="/admin" icon={<List size={17} />} label="Collections" />
          <SidebarLink to="/admin/add-collection" icon={<Plus size={17} />} label="New Artifact" />
          <SidebarLink to="/admin/gallery" icon={<ImageIcon size={17} />} label="Visual Assets" />
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 p-4 text-white/40 hover:text-red-400 transition-colors text-[10px] uppercase tracking-widest mt-auto group"
        >
          <LogOut size={15} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-12 bg-brand-bg overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route index element={<ManageCollections token={token} />} />
            <Route path="add-collection" element={<AddCollection token={token} />} />
            <Route path="edit-collection/:id" element={<EditCollection token={token} />} />
            <Route path="gallery" element={<ManageGallery token={token} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const active = window.location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-4 p-3.5 transition-all text-[10px] uppercase tracking-widest rounded-sm ${active ? 'bg-brand-gold text-black font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'
        }`}
    >
      {icon} {label}
    </Link>
  );
}

function ManageCollections({ token }: { token: string }) {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCollections = () => {
    setLoading(true);
    fetch(`/api/collections?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCollections(data);
          setError('');
        } else {
          setError(data.error || 'Failed to load collections');
          setCollections([]);
        }
      })
      .catch(err => {
        setError('Network error: Could not reach the server');
        setCollections([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCollections(); }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Remove this item from the archive?')) {
      await fetch(`/api/collection/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchCollections();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-serif text-brand-ink mb-2">Collections</h2>
          <div className="w-10 h-px bg-brand-gold/50" />
        </div>
        <Link
          to="/admin/add-collection"
          className="bg-brand-ink text-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-gold transition-all rounded-sm"
        >
          + New Artifact
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-6 h-6 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
            <span className="text-[10px] uppercase tracking-widest text-brand-muted/40">Opening Vault...</span>
          </div>
        ) : error ? (
          <div className="glass-card p-20 text-center border-red-100 bg-red-50/30">
            <p className="text-red-500 text-xs font-medium mb-2">Synchronization Error</p>
            <p className="text-[10px] text-red-400 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">{error}</p>
            <button onClick={fetchCollections} className="mt-6 text-[9px] uppercase tracking-widest text-brand-gold hover:text-brand-ink transition-colors">Try Reconnecting</button>
          </div>
        ) : collections.length === 0 ? (
          <div className="glass-card p-20 text-center text-brand-muted/40 uppercase tracking-[0.2em] text-xs">
            No items in collection
          </div>
        ) : (
          collections.map((item: any) => (
            <div key={item.id} className="glass-card p-4 flex items-center gap-5 group hover:border-brand-gold/30 transition-colors">
              <div className="w-16 h-16 overflow-hidden shrink-0 border border-black/8">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-brand-ink font-medium text-sm">{item.title}</h3>
                  {item.featured ? <span className="text-[8px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full uppercase tracking-widest border border-brand-gold/20">Featured</span> : null}
                </div>
                <p className="text-[10px] text-brand-muted/60 uppercase tracking-widest">{item.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/admin/edit-collection/${item.id}`} className="w-9 h-9 flex items-center justify-center border border-black/8 text-brand-muted/50 hover:text-brand-gold hover:border-brand-gold/40 transition-all rounded-sm">
                  <Edit size={15} />
                </Link>
                <button onClick={() => handleDelete(item.id)} className="w-9 h-9 flex items-center justify-center border border-black/8 text-brand-muted/50 hover:text-red-500 hover:border-red-300 transition-all rounded-sm">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function ItemForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  title,
  loading = false,
}: {
  formData: any;
  setFormData: (d: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
  loading?: boolean;
}) {
  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    // Filter out files that are too large
    const validFiles = files.filter((file: File) => {
      if (file.size > 4 * 1024 * 1024) {
        alert(`"${file.name}" is too large (>4MB) and will be skipped.`);
        return false;
      }
      return true;
    });

    const newImages: string[] = [...(formData.images || [])];
    let loadedCount = 0;

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        loadedCount++;

        if (loadedCount === validFiles.length) {
          setFormData({
            ...formData,
            images: newImages,
            // Automatically set the first image as the primary if none exists
            image: formData.image || newImages[0]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_: any, i: number) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages,
      // If we removed the primary image, pick the next one or clear it
      image: (updatedImages.length > 0) ? updatedImages[0] : ''
    });
  };

  const inputCls = "w-full bg-white border border-black/10 rounded-sm p-3.5 text-sm text-brand-ink focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold/50 outline-none transition-all";
  const labelCls = "block text-[10px] uppercase tracking-[0.15em] text-brand-muted/60 mb-2 ml-1";

  return (
    <form onSubmit={onSubmit} className="glass-card p-10 space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div className="space-y-7">
          <div>
            <label className={labelCls}>Title</label>
            <input type="text" required className={inputCls} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select className={inputCls} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
              <option>Clothes</option>
              <option>Watches</option>
              <option>Perfumes</option>
              <option>Belts</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Artifact Gallery (Main Photo = First image)</label>
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="relative group overflow-hidden border border-dashed border-black/20 bg-black/5 rounded-sm h-[80px] flex flex-col items-center justify-center transition-all hover:border-brand-gold/40 cursor-pointer">
              <input type="file" accept="image/*" multiple onChange={handleMultiImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="flex items-center gap-2 text-brand-muted/50">
                <Plus size={18} />
                <span className="text-[10px] uppercase tracking-widest">Add Images</span>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-4 gap-2">
              {formData.images?.map((img: string, idx: number) => (
                <div key={idx} className="relative group aspect-square border border-black/5 overflow-hidden rounded-sm bg-white">
                  <img src={img} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                  {idx === 0 && (
                    <div className="absolute top-0 left-0 bg-brand-gold text-[6px] text-black px-1 py-0.5 rounded-br-sm uppercase font-bold tracking-tighter">Main</div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea required rows={4} className={inputCls} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      </div>

      <div className="flex items-center gap-3 py-1">
        <input type="checkbox" id="featured" className="w-4 h-4 accent-brand-gold rounded-sm" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} />
        <label htmlFor="featured" className="text-[11px] uppercase tracking-widest text-brand-muted/70">Feature on homepage</label>
      </div>

      <div className="pt-4 border-t border-black/6 flex justify-end gap-5">
        <button type="button" disabled={loading} onClick={onCancel} className="text-[10px] uppercase tracking-widest text-brand-muted/60 hover:text-brand-ink transition-colors disabled:opacity-50">Cancel</button>
        <button
          type="submit"
          disabled={loading}
          className={`bg-brand-ink text-white px-9 py-3.5 text-[10px] uppercase tracking-widest hover:bg-brand-gold transition-all rounded-sm flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {loading ? (
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : <Save size={13} />}
          {loading ? 'Storing...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function AddCollection({ token }: { token: string }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Clothes', image: '', images: [], featured: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload an image first.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/add-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        navigate('/admin');
      } else {
        alert(`Error: ${result.error || 'Failed to save artifact'}`);
      }
    } catch (err) {
      alert('Submission failed. Check your internet connection or the server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate('/admin')} className="text-brand-muted/50 hover:text-brand-gold transition-colors"><ArrowLeft size={20} /></button>
        <div>
          <h2 className="text-3xl font-serif text-brand-ink">New Artifact</h2>
          <div className="w-10 h-px bg-brand-gold/40 mt-2" />
        </div>
      </div>
      <ItemForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onCancel={() => navigate('/admin')} title="New Artifact" loading={loading} />
    </motion.div>
  );
}

function EditCollection({ token }: { token: string }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Clothes', image: '', images: [], featured: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/collections/${id}?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        image: data.image,
        images: data.images || [],
        featured: !!data.featured
      }));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/update-collection/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        navigate('/admin');
      } else {
        alert(`Error: ${result.error || 'Failed to update artifact'}`);
      }
    } catch (err) {
      alert('Update failed. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate('/admin')} className="text-brand-muted/50 hover:text-brand-gold transition-colors"><ArrowLeft size={20} /></button>
        <div>
          <h2 className="text-3xl font-serif text-brand-ink">Edit Artifact</h2>
          <div className="w-10 h-px bg-brand-gold/40 mt-2" />
        </div>
      </div>
      <ItemForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onCancel={() => navigate('/admin')} title="Edit Artifact" loading={loading} />
    </motion.div>
  );
}

function ManageGallery({ token }: { token: string }) {
  const [images, setImages] = useState([]);

  const fetchGallery = () => {
    fetch(`/api/gallery?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error('Failed to fetch gallery:', data.error);
          setImages([]);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setImages([]);
      });
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await fetch('/api/upload-gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ image: reader.result }),
        });
        fetchGallery();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Remove this asset?')) {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchGallery();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-serif text-brand-ink mb-2">Visual Assets</h2>
          <div className="w-10 h-px bg-brand-gold/50" />
        </div>
        <label className="bg-brand-ink text-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-gold transition-all cursor-pointer flex items-center gap-2 rounded-sm">
          <Plus size={14} /> Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {images.map((img: any) => (
          <div key={img.id} className="relative group overflow-hidden aspect-square border border-black/8 shadow-sm">
            <img src={img.image} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-brand-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(img.id)} className="w-10 h-10 bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full glass-card p-20 text-center text-brand-muted/40 uppercase tracking-[0.2em] text-xs">
            No visual assets uploaded yet
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  return (
    <AnimatePresence mode="wait">
      {!token ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AdminLogin setToken={setToken} />
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AdminDashboard token={token} onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
