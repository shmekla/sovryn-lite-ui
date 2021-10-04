import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CircularProgress from '../atom/CircularProgress';
import AppProvider, { AppProviderEvents } from '../../utils/AppProvider';
import { useCountdown } from '../hooks/useCountdown';
import Popover from '../atom/Popover';

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

  const timer = useCountdown(nextUpdate, 500);
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
    <Popover content='Fetch data from the blockchain.'>
      <button onClick={forceRefresh}>
        <CircularProgress progress={progress} transitionMs={500} />
      </button>
    </Popover>
  );
};

export default RequestUpdateButton;
