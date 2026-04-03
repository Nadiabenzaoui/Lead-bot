import { useState, useEffect } from 'react';
import api from '../utils/api';
import { MonitorStats } from '../types';

export function useMonitor() {
  const [stats, setStats] = useState<MonitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<MonitorStats>('/monitor')
      .then(r => setStats(r.data))
      .catch(err => setError(err.response?.data?.error ?? err.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}
