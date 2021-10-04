import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CircularProgress from '../atom/CircularProgress';
import AppProvider, { AppProviderEvents } from '../../utils/AppProvider';
import { useCountdown } from '../hooks/useCountdown';

const transitionMs = 500;

const RequestUpdateButton: React.FC = () => {
  const [nextUpdate, setNextUpdate] = useState(
    AppProvider.lastUpdateRequest + AppProvider.updateTimer,
  );

  const updateCountdown = useCallback(
    () =>
      setNextUpdate(AppProvider.lastUpdateRequest + AppProvider.updateTimer),
    [setNextUpdate],
  );

  const forceRefresh = useCallback(() => AppProvider.requestUpdate(), []);

  const timer = useCountdown(nextUpdate, transitionMs);
  const progress = useMemo(
    () => 100 - (timer / AppProvider.updateTimer) * 100,
    [timer],
  );

  useEffect(() => {
    AppProvider.on(AppProviderEvents.REQUEST_UPDATE, updateCountdown);
    return () => {
      AppProvider.off(AppProviderEvents.REQUEST_UPDATE, updateCountdown);
    };
  }, [updateCountdown]);

  return (
    <button onClick={forceRefresh}>
      <CircularProgress progress={progress} transitionMs={transitionMs} />
    </button>
  );
};

export default RequestUpdateButton;
