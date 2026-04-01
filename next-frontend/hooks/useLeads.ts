import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { Lead, LeadFilters, LeadsResponse } from '../types';

export function useLeads(initialFilters: LeadFilters = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, ...initialFilters });

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined));
      const { data } = await api.get<LeadsResponse>('/leads', { params: { ...params, limit: 20 } });
      setLeads(data.leads);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateFilters = (newFilters: Partial<LeadFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setPage = (page: number) => setFilters(prev => ({ ...prev, page }));

  const deleteLead = async (id: string) => {
    await api.delete(`/leads/${id}`);
    fetch();
  };

  const updateStatut = async (id: string, statut: string) => {
    await api.put(`/leads/${id}`, { statut });
    fetch();
  };

  return { leads, total, loading, error, filters, updateFilters, setPage, deleteLead, updateStatut, refresh: fetch };
}

