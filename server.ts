import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

  // Admin Login
  app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    const { data: admin, error } = await supabase
      .from('admin')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  });

  // Middleware to verify admin
  const verifyAdmin = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Collections API
  app.get('/api/collections', async (req, res) => {
    const { category, featured } = req.query;

    let query = supabase.from('collections').select('*');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query.order('createdAt', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get('/api/collections/:id', async (req, res) => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  });

  app.post('/api/add-collection', verifyAdmin, async (req, res) => {
    const { title, description, category, image, featured } = req.body;

    const { data, error } = await supabase
      .from('collections')
      .insert([
        {
          title,
          description,
          category,
          image,
          featured: !!featured,
          availabilityStatus: req.body.availabilityStatus || 'Available In Store Only'
        }
      ])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id, success: true });
  });

  app.put('/api/update-collection/:id', verifyAdmin, async (req, res) => {
    const { title, description, category, image, featured } = req.body;

    const { error } = await supabase
      .from('collections')
      .update({
        title,
        description,
        category,
        image,
        featured: !!featured,
        availabilityStatus: req.body.availabilityStatus
      })
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete('/api/collection/:id', verifyAdmin, async (req, res) => {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Gallery API
  app.get('/api/gallery', async (req, res) => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('uploadedAt', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post('/api/upload-gallery', verifyAdmin, async (req, res) => {
    const { image } = req.body;

    const { data, error } = await supabase
      .from('gallery')
      .insert([{ image }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id, success: true });
  });

  app.delete('/api/gallery/:id', verifyAdmin, async (req, res) => {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Initial Admin Setup (Seeding if table is empty)
  const setupInitialAdmin = async () => {
    const { data: admins } = await supabase.from('admin').select('id').limit(1);
    if (!admins || admins.length === 0) {
      console.log('Seeding initial admin...');
      const hashedPassword = bcrypt.hashSync('Arabic', 10);
      await supabase.from('admin').insert([{ username: 'Arabic', password: hashedPassword }]);
    }
  };

  // Only attempt seeding if Supabase is configured
  if (supabaseUrl && supabaseKey) {
    setupInitialAdmin().catch(err => console.error('Error seeding admin:', err));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
