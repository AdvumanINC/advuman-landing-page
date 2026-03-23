import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

function useSupabaseQuery(table, { orderBy, ascending = false, limit, filter, channel } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      let q = supabase.from(table).select('*').order(orderBy, { ascending });
      if (limit) q = q.limit(limit);
      if (filter) q = q.eq(filter.col, filter.val);
      const { data: rows, error: err } = await q;
      if (err) throw err;
      setData(rows || []);
      setError(null);
    } catch (err) {
      setError(err?.message || `Failed to load ${table}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [table, orderBy, ascending, limit, filter]);

  useEffect(() => {
    fetch();
    const ch = supabase
      .channel(channel || `${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, fetch)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [fetch, table, channel]);

  return { data, loading, error, refetch: fetch };
}

export const useAlerts = (limit = null) => {
  const { data, loading, error } = useSupabaseQuery('alerts', { orderBy: 'date', limit });
  return { alerts: data, loading, error };
};

export const useSignals = (limit = null) => {
  const { data, loading, error } = useSupabaseQuery('signals', { orderBy: 'created_at', limit });
  return { signals: data, loading, error };
};

export const useSectors = (corridorId = null) => {
  const { data, loading, error } = useSupabaseQuery('sectors', {
    orderBy: 'alert_count',
    filter: corridorId ? { col: 'corridor_id', val: corridorId } : null,
  });
  return { sectors: data, loading, error };
};

export const useCorridors = () => {
  const { data, loading, error } = useSupabaseQuery('corridors', { orderBy: 'name', ascending: true });
  return { corridors: data.filter(c => c.is_active), loading, error };
};

export const useIndexData = (corridorId = null) => {
  const [indexData, setIndexData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      let q = supabase.from('corridor_indexes').select('*').order('snapshot_date', { ascending: true });
      if (corridorId) q = q.eq('corridor_id', corridorId);
      const { data, error: err } = await q;
      if (err) throw err;

      const grouped = {
        rpi: { name: 'Regulatory Pressure Index', abbrev: 'RPI', value: 0, change: 0, history: [] },
        lsi: { name: 'Logistics Strain Index', abbrev: 'LSI', value: 0, change: 0, history: [] },
        cpi: { name: 'Cost Pressure Index', abbrev: 'CPI', value: 0, change: 0, history: [] },
      };
      (data || []).forEach(item => {
        const key = item.index_type.toLowerCase();
        if (grouped[key]) {
          grouped[key].history.push(parseFloat(item.value));
          grouped[key].value = parseFloat(item.value);
          grouped[key].change = parseFloat(item.change_value || 0);
        }
      });
      Object.values(grouped).forEach(g => { g.history = g.history.slice(-12); });
      setIndexData(grouped);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load index data');
      setIndexData({});
    } finally {
      setLoading(false);
    }
  }, [corridorId]);

  useEffect(() => {
    fetch();
    const ch = supabase
      .channel('indexes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'corridor_indexes' }, fetch)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [fetch]);

  return { indexData, loading, error };
};
