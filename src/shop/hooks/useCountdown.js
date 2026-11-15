import { useEffect, useState } from 'react';

// 목표 시각(ms)까지 남은 시간을 시/분으로 돌려줌 (30초마다 갱신)
export function useCountdown(targetMs) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => clearInterval(timer);
  }, []);

  const remainingMs = Math.max(0, targetMs - now);
  const totalMinutes = Math.ceil(remainingMs / (60 * 1000)); // 남은 시간이 있으면 0분으로 보이지 않게 올림

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    isArrived: remainingMs <= 0,
  };
}