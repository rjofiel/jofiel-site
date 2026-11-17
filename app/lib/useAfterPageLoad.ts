import { useEffect, useState } from 'react';

type Cancel = () => void;

const IDLE_TIMEOUT_MS = 3000;

const whenIdle = (run: () => void): Cancel => {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(run, 0);
  return () => window.clearTimeout(id);
};

const afterPageLoad = (run: () => void): Cancel => {
  if (document.readyState === 'complete') return whenIdle(run);
  let cancelIdle: Cancel = () => {};
  const onLoad = () => {
    cancelIdle = whenIdle(run);
  };
  window.addEventListener('load', onLoad, { once: true });
  return () => {
    window.removeEventListener('load', onLoad);
    cancelIdle();
  };
};

export const useAfterPageLoad = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => afterPageLoad(() => setReady(true)), []);
  return ready;
};
