import { useEffect, useRef } from 'react';

export function useShake(onShake, threshold = 15) {
  const lastX = useRef(null);
  const lastY = useRef(null);
  const lastZ = useRef(null);
  const cooldown = useRef(false);

  useEffect(() => {
    const handleMotion = (e) => {
      if (cooldown.current) return;
      const { x, y, z } = e.accelerationIncludingGravity || {};
      if (x == null) return;

      if (lastX.current !== null) {
        const dx = Math.abs(x - lastX.current);
        const dy = Math.abs(y - lastY.current);
        const dz = Math.abs(z - lastZ.current);
        if (dx + dy + dz > threshold) {
          cooldown.current = true;
          onShake();
          setTimeout(() => { cooldown.current = false; }, 2000);
        }
      }

      lastX.current = x;
      lastY.current = y;
      lastZ.current = z;
    };

    if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (typeof DeviceMotionEvent !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [onShake, threshold]);
}
