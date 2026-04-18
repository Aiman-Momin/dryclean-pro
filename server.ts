import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Read Firebase Config
  let firebaseConfig: any;
  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    const configRaw = fs.readFileSync(configPath, 'utf8');
    firebaseConfig = JSON.parse(configRaw);
  } catch (error) {
    console.error('CRITICAL: Failed to read firebase-applet-config.json:', error);
    // If we can't read config, the server might still start to serve Vite, but API will fail.
  }

  // Initialize Firebase Admin
  let firestore: any;
  if (firebaseConfig) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          projectId: firebaseConfig.projectId,
        });
      }
      
      // Use getFirestore with specific databaseId if available
      if (firebaseConfig.firestoreDatabaseId) {
        firestore = getFirestore(admin.apps[0]!, firebaseConfig.firestoreDatabaseId);
      } else {
        firestore = getFirestore(admin.apps[0]!);
      }
    } catch (error) {
      console.error('ERROR: Failed to initialize Firebase Admin/Firestore:', error);
    }
  }

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GET all orders
  app.get('/api/orders', async (req, res) => {
    if (!firestore) return res.status(500).json({ error: 'Firestore not initialized' });
    try {
      const snapshot = await firestore.collection('orders').orderBy('createdAt', 'desc').get();
      const orders = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // GET order by ID
  app.get('/api/orders/:id', async (req, res) => {
    if (!firestore) return res.status(500).json({ error: 'Firestore not initialized' });
    try {
      const doc = await firestore.collection('orders').doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting Vite in middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Health: http://localhost:${PORT}/api/health`);
    console.log(`API (Orders): http://localhost:${PORT}/api/orders`);
  });
}

startServer().catch((error) => {
  console.error('FATAL: Startup error:', error);
});
