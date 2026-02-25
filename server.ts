import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Forced Cache-Busting for API
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Simple request logger for debugging Vercel
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API Request] ${req.method} ${req.path}`);
  }
  next();
});

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'ArabicCollectionSecret2025';

let supabase: any = null;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (err) {
  console.error('Supabase Init Error:', err);
}

// Health check endpoint - MUST BE DEFINED FIRST
app.get('/api/health', (req, res) => {
  try {
    res.status(200).json({
      status: 'ok',
      supabase: !!supabase,
      env_vars: {
        url: !!supabaseUrl,
        key: !!supabaseKey,
        jwt: !!process.env.JWT_SECRET
      },
      environment: process.env.NODE_ENV || 'unknown'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Health check failed', details: err.message });
  }
});

// Admin Login with Lazy Seeding
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase is not configured. Check Vercel environment variables.' });
  }

  try {
    // Check for admin table
    const { data: admins, error: countError } = await supabase.from('admin').select('id').limit(1);

    if (countError) {
      return res.status(500).json({ error: 'Database Connection Error: ' + countError.message });
    }

    if (!admins || admins.length === 0) {
      console.log('Seeding default admin...');
      const hashedPassword = bcrypt.hashSync('Arabic', 10);
      await supabase.from('admin').insert([{ username: 'Arabic', password: hashedPassword }]);
    }

    // Login
    const { data: admin, error } = await supabase
      .from('admin')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication service encountered an error.' });
  }
});

// Verify Admin Middleware
const verifyAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired' });
  }
};

// Collections API
app.get('/api/collections', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  const { category, featured } = req.query;

  try {
    let query = supabase.from('collections').select('id, title, description, category, image, featured, createdAt');
    if (category && category !== 'All') query = query.eq('category', category);
    if (featured === 'true') query = query.eq('featured', true);

    const { data, error } = await query.order('createdAt', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/collections/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  const { data, error } = await supabase.from('collections').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'Artifact not found' });
  res.json(data);
});

app.post('/api/add-collection', verifyAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  const { title, description, category, image, featured } = req.body;

  try {
    const payload: any = {
      title,
      description,
      category,
      image,
      featured: !!featured
    };

    // Only include availabilityStatus if it's explicitly provided
    if (req.body.availabilityStatus) {
      payload.availabilityStatus = req.body.availabilityStatus;
    }

    const { data, error } = await supabase.from('collections').insert([payload]).select();

    if (error) {
      console.error('Insert error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'Failed to create item. No data returned from database.' });
    }

    res.json({ id: data[0].id, success: true });
  } catch (err: any) {
    console.error('Critical Add Collection Error:', err);
    res.status(500).json({ error: 'Server error during item creation.' });
  }
});

app.put('/api/update-collection/:id', verifyAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  const { title, description, category, image, featured, availabilityStatus } = req.body;

  try {
    const payload: any = {
      title,
      description,
      category,
      image,
      featured: !!featured
    };

    if (availabilityStatus) {
      payload.availabilityStatus = availabilityStatus;
    }

    const { error } = await supabase
      .from('collections')
      .update(payload)
      .eq('id', req.params.id);

    if (error) {
      console.error('Update error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('Critical Update Collection Error:', err);
    res.status(500).json({ error: 'Server error during item update.' });
  }
});

app.delete('/api/collection/:id', verifyAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  const { error } = await supabase.from('collections').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Gallery API
app.get('/api/gallery', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  const { data, error } = await supabase.from('gallery').select('*').order('uploadedAt', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post('/api/upload-gallery', verifyAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  const { image } = req.body;

  try {
    const { data, error } = await supabase.from('gallery').insert([{ image }]).select();

    if (error) {
      console.error('Gallery upload error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'Failed to upload image to gallery.' });
    }

    res.json({ id: data[0].id, success: true });
  } catch (err: any) {
    console.error('Critical Gallery Upload Error:', err);
    res.status(500).json({ error: 'Server error during gallery upload.' });
  }
});

app.delete('/api/gallery/:id', verifyAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  const { error } = await supabase.from('gallery').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Production: serve static files
if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Local Dev: Vite integration (Dynamic import to avoid production overhead/errors)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL_ENV) {
  const setupVite = async () => {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);

      const PORT = Number(process.env.PORT) || 3000;
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Dev server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('Vite Start Error:', err);
    }
  };
  setupVite();
}

// Export for Vercel
export default app;
