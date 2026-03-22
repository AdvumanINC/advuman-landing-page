import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Hook to fetch alerts from database
export const useAlerts = (limit = null) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAlerts();

    const channel = supabase
      .channel('alerts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
        loadAlerts();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [limit]);

  const loadAlerts = async () => {
    try {
      let query = supabase
        .from('alerts')
        .select('*')
        .order('date', { ascending: false });
      
      if (limit) query = query.limit(limit);
      
      const { data, error: err } = await query;
      if (err) throw err;
      if (data) setAlerts(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load alerts');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  return { alerts, loading, error };
};


// Hook to fetch signals from database
export const useSignals = (limit = null) => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSignals();

    const channel = supabase
      .channel('signals_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signals' }, () => {
        loadSignals();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [limit]);

  const loadSignals = async () => {
    try {
      let query = supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (limit) query = query.limit(limit);
      
      const { data, error: err } = await query;
      if (err) throw err;
      if (data) setSignals(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load signals');
      setSignals([]);
    } finally {
      setLoading(false);
    }
  };

  return { signals, loading, error };
};

// Hook to fetch sectors from database
export const useSectors = (corridorId = null) => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSectors();

    const channel = supabase
      .channel('sectors_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sectors' }, () => {
        loadSectors();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [corridorId]);

  const loadSectors = async () => {
    try {
      let query = supabase
        .from('sectors')
        .select('*')
        .order('alert_count', { ascending: false });
      
      if (corridorId) query = query.eq('corridor_id', corridorId);
      
      const { data, error: err } = await query;
      if (err) throw err;
      if (data) setSectors(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load sectors');
      setSectors([]);
    } finally {
      setLoading(false);
    }
  };

  return { sectors, loading, error };
};


// Hook to fetch index data from database
export const useIndexData = (corridorId = null) => {
  const [indexData, setIndexData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIndexData();

    const channel = supabase
      .channel('indexes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'corridor_indexes' }, () => {
        loadIndexData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [corridorId]);

  const loadIndexData = async () => {
    try {
      let query = supabase
        .from('corridor_indexes')
        .select('*')
        .order('snapshot_date', { ascending: true });
      
      if (corridorId) query = query.eq('corridor_id', corridorId);
      
      const { data, error: err } = await query;
      if (err) throw err;
      
      if (data) {
        // Group by index type and get latest values + history
        const grouped = {
          rpi: { 
            name: 'Regulatory Pressure Index', 
            abbrev: 'RPI', 
            description: 'Measures regulatory burden and policy volatility affecting cross-border trade',
            value: 0, 
            change: 0, 
            history: [] 
          },
          lsi: { 
            name: 'Logistics Strain Index', 
            abbrev: 'LSI', 
            description: 'Tracks shipping costs, port congestion, and supply chain disruption risk',
            value: 0, 
            change: 0, 
            history: [] 
          },
          cpi: { 
            name: 'Cost Pressure Index', 
            abbrev: 'CPI', 
            description: 'Quantifies standards, certification, and documentation requirements',
            value: 0, 
            change: 0, 
            history: [] 
          }
        };

        data.forEach(item => {
          const key = item.index_type.toLowerCase();
          if (grouped[key]) {
            grouped[key].history.push(parseFloat(item.value));
            grouped[key].value = parseFloat(item.value);
            grouped[key].change = parseFloat(item.change_value || 0);
          }
        });

        Object.keys(grouped).forEach(key => {
          grouped[key].history = grouped[key].history.slice(-12);
        });

        setIndexData(grouped);
        setError(null);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load index data');
      setIndexData({});
    } finally {
      setLoading(false);
    }
  };

  return { indexData, loading, error };
};

// Hook to fetch corridors
export const useCorridors = () => {
  const [corridors, setCorridors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCorridors();

    const channel = supabase
      .channel('corridors_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'corridors' }, () => {
        loadCorridors();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const loadCorridors = async () => {
    try {
      const { data, error: err } = await supabase
        .from('corridors')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (err) throw err;
      if (data) setCorridors(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load corridors');
      setCorridors([]);
    } finally {
      setLoading(false);
    }
  };

  return { corridors, loading, error };
};
