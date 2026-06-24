import { cn } from '@/utils/cn';
import { useMotionValue, animate, motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import useMeasure from 'react-use-measure';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  // Drag state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartVal = useRef(0);

  useEffect(() => {
    if (isDragging.current) return;

    const contentSize = width + gap;
    if (width <= 0) return;

    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    let controls: ReturnType<typeof animate>;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prev) => prev + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    controlsRef.current = controls;
    return () => controls?.stop();
  }, [key, translation, currentDuration, width, gap, isTransitioning, reverse]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          if (!isDragging.current) {
            setIsTransitioning(true);
            setCurrentDuration(duration);
          }
        },
      }
    : {};

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartVal.current = translation.get();
    controlsRef.current?.stop();
  }, [translation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const diff = e.clientX - dragStartX.current;
    translation.set(dragStartVal.current + diff);
  }, [translation]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsTransitioning(true);
    setCurrentDuration(duration);
    setKey((prev) => prev + 1);
  }, [duration]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartVal.current = translation.get();
    controlsRef.current?.stop();
  }, [translation]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.touches[0].clientX - dragStartX.current;
    translation.set(dragStartVal.current + diff);
  }, [translation]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsTransitioning(true);
    setCurrentDuration(duration);
    setKey((prev) => prev + 1);
  }, [duration]);

  return (
    // The marquee mechanics (max-content flex row + physical translateX) assume
    // an LTR coordinate frame. The app runs under dir="rtl", which lays the row
    // out from the right and flips the overflow side, pushing cards into the
    // clipped region. Pin the slider's layout to LTR; card text is centered so
    // this has no visual effect on the Arabic content.
    <div
      dir="ltr"
      className={cn('overflow-hidden', className)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging.current ? 'grabbing' : 'grab', userSelect: 'none' }}
    >
      <motion.div
        className="flex w-max"
        style={{ x: translation, gap: `${gap}px` }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
