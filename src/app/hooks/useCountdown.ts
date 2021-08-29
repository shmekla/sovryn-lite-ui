import { useCallback, useEffect, useState } from 'react';

export function useCountdown(endTime: number, delay: number = 1000) {

  const getTimeLeft = useCallback(() => {
    const time = endTime - Date.now();
    return time > 0 ? time : 0;
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const intervalRef: NodeJS.Timeout = setInterval(() => setTimeLeft(getTimeLeft()), delay);
    return () => {
      if (intervalRef) {
        clearInterval(intervalRef);
      }
    }
  }, [endTime, delay, getTimeLeft]);

  return timeLeft;
}
