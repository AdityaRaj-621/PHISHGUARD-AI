// src/hooks/useScan.js
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useScan(scanServiceFn) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'running', 'success', 'error', 'timeout'
  const [currentStage, setCurrentStage] = useState(1);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  const startScan = useCallback(async (payload, options = {}) => {
    setOverlayOpen(true);
    setStatus('running');
    setCurrentStage(1);
    setError(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const startTime = Date.now();
    let stageInterval = null;

    // Truthful stage progression (§20)
    // Stage 1 marks on request send
    // Stages 2-5 advance every ~600ms while promise pending
    let stageCounter = 1;
    stageInterval = setInterval(() => {
      if (stageCounter < 5) {
        stageCounter += 1;
        setCurrentStage(stageCounter);
      }
    }, 600);

    try {
      const result = await scanServiceFn(payload, {
        signal: abortController.signal,
        ...options
      });

      clearInterval(stageInterval);

      // Ensure minimum 1200ms total duration for legibility (§20)
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 1200 - elapsed);

      if (remainingTime > 0) {
        await new Promise((r) => setTimeout(r, remainingTime));
      }

      setCurrentStage(6);
      setStatus('success');

      // 250ms hold then navigate
      setTimeout(() => {
        setOverlayOpen(false);
        navigate(`/scans/${result.id}`, { state: { result, fresh: true } });
      }, 250);

      return result;
    } catch (err) {
      clearInterval(stageInterval);
      if (err?.kind === 'canceled' || err?.message === 'Scan canceled.') {
        setStatus('idle');
        setOverlayOpen(false);
        return;
      }

      if (err?.code === 'ECONNABORTED' || err?.kind === 'timeout') {
        setStatus('timeout');
        setError('This is taking longer than expected.');
      } else {
        setStatus('error');
        setError(err?.message || "PhishGuard couldn't complete the scan.");
      }
    }
  }, [scanServiceFn, navigate]);

  const cancelScan = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setOverlayOpen(false);
    setStatus('idle');
  }, []);

  const resetScan = useCallback(() => {
    setOverlayOpen(false);
    setStatus('idle');
    setCurrentStage(1);
    setError(null);
  }, []);

  return {
    overlayOpen,
    status,
    currentStage,
    error,
    startScan,
    cancelScan,
    resetScan
  };
}
