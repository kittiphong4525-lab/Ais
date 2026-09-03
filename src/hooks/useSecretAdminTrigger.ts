import { useState, useRef, useCallback } from 'react';

interface SecretTriggerOptions {
  requiredClicks?: number;
  timeoutMs?: number;
  onTrigger: () => void;
}

export function useSecretAdminTrigger({
  requiredClicks = 5,
  timeoutMs = 3000,
  onTrigger,
}: SecretTriggerOptions) {
  const [clickCount, setClickCount] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        // Prevent accidental link navigation when clicking secret trigger
        e.preventDefault();
        e.stopPropagation();
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const nextCount = clickCount + 1;

      if (nextCount >= requiredClicks) {
        setClickCount(0);
        onTrigger();
      } else {
        setClickCount(nextCount);
        timerRef.current = setTimeout(() => {
          setClickCount(0);
        }, timeoutMs);
      }
    },
    [clickCount, requiredClicks, timeoutMs, onTrigger]
  );

  const remainingClicks = requiredClicks - clickCount;
  const isCounting = clickCount > 0 && clickCount < requiredClicks;

  return {
    handleClick,
    clickCount,
    remainingClicks,
    isCounting,
  };
}
