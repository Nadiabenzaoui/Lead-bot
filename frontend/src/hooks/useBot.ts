import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../utils/api';
import { LogEntry, BotStatus, BotConfig } from '../types';
import { API_URL } from '../constants';

export function useBot() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<BotStatus | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const addLog = (entry: Omit<LogEntry, 'ts'>) => {
    setLogs(prev => [...prev, { ...entry, ts: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    const socket = io(API_URL);
    socketRef.current = socket;

    socket.on('bot:log', (data: { message: string; step?: string }) => addLog({ type: 'log', ...data }));
    socket.on('bot:lead', (lead: any) => addLog({ type: 'lead', message: `Lead saved: ${lead.nom} (${lead.score}/10)` }));
    socket.on('bot:done', (data: { total: number }) => {
      addLog({ type: 'done', message: `Completed — ${data.total} leads saved` });
      setRunning(false);
    });
    socket.on('bot:error', (data: { message: string }) => {
      addLog({ type: 'error', message: data.message });
      setRunning(false);
    });

    fetchStatus();
    return () => { socket.disconnect(); };
  }, []);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get<BotStatus>('/bot/status');
      setStatus(data);
    } catch {}
  };

  const start = async (config: BotConfig) => {
    setLogs([]);
    setRunning(true);
    await api.post('/bot/start', config);
  };

  const stop = async () => {
    await api.post('/bot/stop');
    setRunning(false);
    addLog({ type: 'warn', message: 'Bot stopped manually' });
  };

  const clearLogs = () => setLogs([]);

  return { running, logs, status, start, stop, clearLogs };
}
