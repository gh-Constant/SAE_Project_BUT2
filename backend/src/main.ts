import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello eAPI' });
});

app.get('/api/roles', async (req: Request, res: Response) => {
  try {
    res.send({ message: 'Not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
