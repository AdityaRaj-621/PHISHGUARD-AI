// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFn, immediate = true, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [apiFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, ...deps]);

  return { data, loading, error, refetch: execute, setData };
}
