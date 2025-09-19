import express from 'express';
import cors from 'cors';
import db from '../models/index';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello eAPI' });
});

app.get('/api/roles', async (req, res) => {
  try {
    const roles = await db.Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Sync database
db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}).catch((err: any) => {
  console.error('Unable to sync database:', err);
});
