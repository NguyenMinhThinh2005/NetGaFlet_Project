import { useRef, useCallback } from 'react';
import { Accelerometer } from 'expo-sensors';
import { useFocusEffect } from 'expo-router';

export function useShake(onShake: () => void, threshold = 1.8) {
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const lastZ = useRef<number | null>(null);
  const cooldown = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let subscription: { remove: () => void } | null = null;
      let timeoutId: NodeJS.Timeout;

      const subscribe = async () => {
        try {
          const isAvailable = await Accelerometer.isAvailableAsync();
          if (!isAvailable) return;

          Accelerometer.setUpdateInterval(100);
          subscription = Accelerometer.addListener(data => {
            if (cooldown.current) return;
            const { x, y, z } = data;

            if (lastX.current !== null && lastY.current !== null && lastZ.current !== null) {
              const dx = Math.abs(x - lastX.current);
              const dy = Math.abs(y - lastY.current);
              const dz = Math.abs(z - lastZ.current);

              if (dx + dy + dz > threshold) {
                cooldown.current = true;
                onShake();
                let timeoutId: ReturnType<typeof setTimeout>;
                timeoutId = setTimeout(() => {
                  cooldown.current = false;
                }, 3000);
              }
            }

            lastX.current = x;
            lastY.current = y;
            lastZ.current = z;
          });
        } catch (err) {
          console.warn('Accelerometer sensor initialization error:', err);
        }
      };

      subscribe();

      return () => {
        if (subscription) {
          subscription.remove();
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        lastX.current = null;
        lastY.current = null;
        lastZ.current = null;
        cooldown.current = false;
      };
    }, [onShake, threshold])
  );
}
