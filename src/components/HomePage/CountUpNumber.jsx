import { useEffect, useRef, useState } from "react";

export function CountUpNumber({
  value = 0,
  duration = 500,
  decimals = 0,
  suffix = "",
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const startValue = 0;
    const endValue = Number(value) || 0;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = startValue + (endValue - startValue) * progress;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return (
    <span>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}