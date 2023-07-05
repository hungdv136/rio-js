import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { pay, PayRequest } from './payment';

dotenv.config();
const port = process.env.PORT || 8808;

const app: Express = express();
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

app.post('/checkout', async (req: Request, res: Response) => {
  const reqParam: PayRequest = req.body
  const data = await pay(reqParam)
  res.send(data)
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});