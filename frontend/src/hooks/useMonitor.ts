import { useState, useEffect } from 'react';
import api from '../utils/api';
import { MonitorStats } from '../types';

export function useMonitor(refreshInterval = 10000) {
  const [stats, setStats] = useState<MonitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      const { data } = await api.get<MonitorStats>('/monitor');
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { stats, loading, error, refresh: fetch };
}
