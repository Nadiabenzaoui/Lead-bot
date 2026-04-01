import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { initWebSocket } from './websocket';
import { setIO } from './bot/queue';

import leadsRouter from './routes/leads';
import scoreRouter from './routes/score';
import sendRouter from './routes/send';
import monitorRouter from './routes/monitor';
import botRouter from './routes/bot';
import exportRouter from './routes/export';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// WebSocket
const io = initWebSocket(server);
setIO(io);

// Routes
app.use('/leads', leadsRouter);
app.use('/score', scoreRouter);
app.use('/send', sendRouter);
app.use('/monitor', monitorRouter);
app.use('/bot', botRouter);
app.use('/export', exportRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
