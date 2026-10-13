import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

/**
 * AnimatedNumber — smoothly tweens the displayed value whenever `value`
 * changes (and counts up from zero on first mount), then applies `format`
 * to the in-flight value so currency/percent formatting stays correct
 * mid-animation.
 */
export default function AnimatedNumber({ value, format, duration = 0.7, className }) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const controls = animate(current.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span className={className}>{format(display)}</span>;
}
