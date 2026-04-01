import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Lead, SendForm } from '../types';

export function useSend() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    api.get('/leads', { params: { limit: 100 } }).then(({ data }) => setLeads(data.leads));
  }, []);

  const send = async (form: SendForm) => {
    setLoading(true);
    setResult(null);
    try {
      await api.post('/send', form);
      setResult({ success: true, message: 'Message sent successfully' });
    } catch (err: any) {
      setResult({ success: false, message: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  return { leads, loading, result, send, clearResult: () => setResult(null) };
}
