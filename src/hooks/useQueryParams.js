// src/hooks/useQueryParams.js
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key, defaultValue = '') => {
    return searchParams.get(key) || defaultValue;
  }, [searchParams]);

  const setParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === undefined || value === null || value === '' || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setMultipleParams = useCallback((paramsObj) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || value === 'all') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  return { getParam, setParam, setMultipleParams, searchParams };
}
