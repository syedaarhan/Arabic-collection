import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('database.sqlite');

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    category TEXT,
    image TEXT,
    featured INTEGER DEFAULT 0,
    availabilityStatus TEXT DEFAULT 'Available In Store Only',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed admin if not exists or update existing
const hashedPassword = bcrypt.hashSync('Arabic', 10);
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin').get() as { count: number };
if (adminCount.count === 0) {
  db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('Arabic', hashedPassword);
} else {
  db.prepare('UPDATE admin SET username = ?, password = ?').run('Arabic', hashedPassword);
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username) as any;

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
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
  app.get('/api/collections', (req, res) => {
    const { category, featured } = req.query;
    let query = 'SELECT * FROM collections';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (featured === 'true') {
      conditions.push('featured = 1');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY createdAt DESC';

    const collections = db.prepare(query).all(...params);
    res.json(collections);
  });

  app.get('/api/collections/:id', (req, res) => {
    const collection = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
    if (!collection) return res.status(404).json({ error: 'Not found' });
    res.json(collection);
  });

  app.post('/api/add-collection', verifyAdmin, (req, res) => {
    const { title, description, category, image, featured } = req.body;
    const stmt = db.prepare('INSERT INTO collections (title, description, category, image, featured) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(title, description, category, image, featured ? 1 : 0);
    res.json({ id: result.lastInsertRowid, success: true });
  });

  app.put('/api/update-collection/:id', verifyAdmin, (req, res) => {
    const { title, description, category, image, featured } = req.body;
    const stmt = db.prepare('UPDATE collections SET title = ?, description = ?, category = ?, image = ?, featured = ? WHERE id = ?');
    stmt.run(title, description, category, image, featured ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/collection/:id', verifyAdmin, (req, res) => {
    db.prepare('DELETE FROM collections WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Gallery API
  app.get('/api/gallery', (req, res) => {
    const gallery = db.prepare('SELECT * FROM gallery ORDER BY uploadedAt DESC').all();
    res.json(gallery);
  });

  app.post('/api/upload-gallery', verifyAdmin, (req, res) => {
    const { image } = req.body;
    const stmt = db.prepare('INSERT INTO gallery (image) VALUES (?)');
    const result = stmt.run(image);
    res.json({ id: result.lastInsertRowid, success: true });
  });

  app.delete('/api/gallery/:id', verifyAdmin, (req, res) => {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
