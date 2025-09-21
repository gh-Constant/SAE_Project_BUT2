import express from 'express';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

// Configure CORS for production deployment
const corsOptions = {
  origin: [
    'http://localhost:4200',                    // Local development       // Production frontend
    'http://livrable.constantsuchet.fr'         // If not using HTTPS
  ],
  credentials: true,                            // Allow cookies if needed
  optionsSuccessStatus: 200                     // For older browsers
};

app.use(cors(corsOptions));
app.use(express.json());                        // Parse JSON requests

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
