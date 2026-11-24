'use client';

import React, { Children, Fragment, isValidElement, useLayoutEffect, useRef } from 'react';
import './ScrollStack.css';

const resolveOffset = (value: string | number, size: number): number => {
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (text.endsWith('%')) return (parseFloat(text) / 100) * size;
  return parseFloat(text) || 0;
};

const toLength = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);

const scrollsInside = (node: Element | null, stop: Element | null, delta: number): boolean => {
  for (let element = node; element && element !== stop; element = element.parentElement) {
    if (element.scrollHeight <= element.clientHeight + 1) continue;
    const overflow = getComputedStyle(element).overflowY;
    if (overflow !== 'auto' && overflow !== 'scroll') continue;
    if (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0) {
      return true;
    }
  }
  return false;
};

export interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
  style?: React.CSSProperties;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '', style }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style}>
    {children}
    <span className="scroll-stack-card__shade" aria-hidden="true" />
  </div>
);

export interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  itemScale?: number;
  baseScale?: number;
  dimAmount?: number;
  blurAmount?: number;
  tiltAmount?: number;
  rotationAmount?: number;
  holdDistance?: number;
  smoothScroll?: boolean;
  snap?: boolean;
  useWindowScroll?: boolean;
  wheelContainerRef?: React.RefObject<HTMLElement | null>;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemStackDistance = 24,
  stackPosition = '15%',
  itemScale = 0.05,
  baseScale = 0.8,
  dimAmount = 0.2,
  blurAmount = 0,
  tiltAmount = 0,
  rotationAmount = 0,
  holdDistance = 200,
  smoothScroll = true,
  snap = false,
  useWindowScroll = false,
  wheelContainerRef,
  onStackComplete
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<any>(null);
  const scheduleRef = useRef<(() => void) | null>(null);
  const items = Children.toArray(children);

  useLayoutEffect(() => {
    settingsRef.current = {
      itemDistance,
      itemStackDistance,
      stackPosition,
      itemScale,
      baseScale,
      dimAmount,
      blurAmount,
      tiltAmount,
      rotationAmount,
      holdDistance,
      smoothScroll,
      snap,
      onStackComplete
    };
    scheduleRef.current?.();
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const end = endRef.current;
    if (!root || !inner || !end) return undefined;

    const windowed = useWindowScroll;
    const target: EventTarget = windowed ? window : root;
    const wheelTarget: EventTarget = window;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cache = new Map<string, any>();
    let frame = 0;
    let glide = 0;
    let rest = 0;
    let complete = false;
    let gliding = false;
    let pressed = false;
    let current = 0;
    let goal = 0;
    let written = 0;
    let last = 0;
    let points: number[] = [];
    let reach = 0;

    const readScroll = () => (windowed ? window.scrollY : root.scrollTop);
    const maxScroll = () =>
      windowed ? document.documentElement.scrollHeight - window.innerHeight : root.scrollHeight - root.clientHeight;
    const writeScroll = (value: number) => {
      written = value;
      if (windowed) {
        (target as Window).scrollTo({ top: value, behavior: 'instant' as ScrollBehavior });
      } else if (root) {
        root.scrollTop = value;
        written = root.scrollTop;
      }
    };

    const write = (key: string, value: any, apply: (val: any) => void) => {
      if (cache.get(key) === value) return false;
      cache.set(key, value);
      apply(value);
      return true;
    };

    const update = () => {
      frame = 0;
      const settings = settingsRef.current;
      const slots = Array.from(inner.children).filter(child => (child as HTMLElement).hasAttribute('data-stack-slot')) as HTMLElement[];
      if (!settings || !slots.length) return;

      const viewHeight = windowed ? window.innerHeight : root.clientHeight;
      const viewTop = windowed ? 0 : root.getBoundingClientRect().top + root.clientTop;
      const stackTop = resolveOffset(settings.stackPosition, viewHeight);
      const offset = settings.itemStackDistance;
      const heights = slots.map(slot => slot.offsetHeight);
      const tops = slots.map(slot => slot.getBoundingClientRect().top);
      const lastPin = stackTop + (slots.length - 1) * offset;
      const padTop = windowed ? 0 : stackTop;
      const endHeight =
        settings.holdDistance + (windowed ? 0 : Math.max(0, viewHeight - lastPin - heights[heights.length - 1]));

      let moved = write('padTop', padTop, (value: number) => {
        inner.style.paddingTop = `${value}px`;
      });
      moved =
        write('endHeight', endHeight, (value: number) => {
          end.style.height = `${value}px`;
        }) || moved;

      let flow = inner.getBoundingClientRect().top - viewTop + readScroll() + padTop;
      points = heights.map((height, i) => {
        const point = flow - stackTop - i * offset;
        flow += height + settings.itemDistance;
        return point;
      });
      reach = Math.max(40, (heights[0] + settings.itemDistance - offset) / 2);

      const depths = slots.map(() => 0);
      let lastCover = 0;
      for (let j = 1; j < slots.length; j++) {
        const pinBefore = viewTop + stackTop + (j - 1) * offset;
        const start = pinBefore + heights[j - 1];
        const span = Math.max(1, start - pinBefore - offset);
        const cover = Math.min(1, Math.max(0, (start - tops[j]) / span));
        for (let i = 0; i < j; i++) depths[i] += cover;
        lastCover = cover;
      }

      const dimStep = Math.min(Math.max(settings.dimAmount, 0), 1);
      slots.forEach((slot, i) => {
        const card = slot.firstElementChild as HTMLElement | null;
        if (!card) return;
        const depth = depths[i];
        const lean = Math.min(depth, 1);
        const scale = Math.max(Math.min(settings.baseScale, 1), 1 - depth * settings.itemScale);
        const tilt = -lean * settings.tiltAmount;
        const turn = lean * settings.rotationAmount * (i % 2 ? -1 : 1);
        const blur = depth * settings.blurAmount;
        const dim = 1 - Math.pow(1 - dimStep, depth);
        const transform =
          depth < 0.0005
            ? ''
            : `perspective(1200px) rotateX(${tilt.toFixed(2)}deg) rotate(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        write(`transform${i}`, transform, (value: string) => {
          card.style.transform = value;
        });
        write(`filter${i}`, blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : '', (value: string) => {
          card.style.filter = value;
        });
        write(`dim${i}`, dim.toFixed(3), (value: string) => {
          card.style.setProperty('--scroll-stack-dim', value);
        });
      });

      const done = slots.length > 1 && lastCover >= 0.999;
      if (done !== complete) {
        complete = done;
        if (done) settings.onStackComplete?.();
      }

      if (moved) schedule();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (pressed || Math.abs(readScroll() - written) > 30) {
        gliding = false;
        glide = 0;
        settleSoon();
        return;
      }
      current += (goal - current) * (1 - Math.pow(0.88, dt * 60));
      if (Math.abs(goal - current) < 0.5) current = goal;
      writeScroll(current);
      if (current === goal) {
        gliding = false;
        glide = 0;
        settleSoon();
        return;
      }
      glide = requestAnimationFrame(step);
    };

    const glideTo = (value: number) => {
      goal = Math.min(Math.max(value, 0), maxScroll());
      if (motion.matches) {
        writeScroll(goal);
        return;
      }
      if (gliding) return;
      gliding = true;
      current = readScroll();
      written = current;
      last = performance.now();
      glide = requestAnimationFrame(step);
    };

    const settle = () => {
      rest = 0;
      if (!settingsRef.current?.snap || gliding || pressed || !points.length) return;
      const now = readScroll();
      const nearest = points.reduce((best, point) => (Math.abs(point - now) < Math.abs(best - now) ? point : best));
      const gap = Math.abs(nearest - now);
      if (gap > 1 && gap < reach) glideTo(nearest);
    };

    const settleSoon = () => {
      window.clearTimeout(rest);
      rest = window.setTimeout(settle, 140);
    };

    const onScroll = () => {
      schedule();
      if (!gliding) settleSoon();
    };

    const onWheel = (event: WheelEvent) => {
      if (!settingsRef.current?.smoothScroll || motion.matches || event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const page = windowed ? window.innerHeight : root.clientHeight;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page : 1);
      if (!delta) return;

      const eventTarget = event.target as Element | null;
      const insideCards = Boolean(eventTarget && root.contains(eventTarget));

      if (!windowed) {
        const sectionEl = wheelContainerRef?.current ?? root.closest('section') ?? root;
        const inSectionDom = Boolean(eventTarget && sectionEl.contains(eventTarget));
        if (!inSectionDom) {
          // Skip if pointer is over header/nav or a different page section
          const eventSection = eventTarget?.closest('section');
          if (!eventTarget || eventTarget.closest('header, nav') || (eventSection && eventSection !== sectionEl)) return;
          const sRect = sectionEl.getBoundingClientRect();
          const inSectionRect =
            event.clientX >= sRect.left &&
            event.clientX <= sRect.right &&
            event.clientY >= sRect.top &&
            event.clientY <= sRect.bottom;
          if (!inSectionRect) return;
        }
      }

      if (insideCards && scrollsInside(eventTarget, windowed ? document.body : root, delta)) return;

      // When cursor is outside the card box (elsewhere in the section), activate as soon as the stack is visible in viewport
      if (!windowed && !insideCards) {
        const rect = root.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top >= vh - 80 || rect.bottom <= 80) return;
      }

      const currentScroll = readScroll();
      const max = maxScroll();
      if (max <= 1) return;

      // If at top boundary and scrolling up, allow outer page scroll
      if (delta < 0 && currentScroll <= 1) return;
      // If at bottom boundary and scrolling down, allow outer page scroll
      if (delta > 0 && currentScroll >= max - 1) return;

      event.preventDefault();
      window.clearTimeout(rest);
      const base = gliding ? goal : currentScroll;
      glideTo(base + delta);
    };

    const onPress = () => {
      pressed = true;
      window.clearTimeout(rest);
    };

    const onRelease = () => {
      if (!pressed) return;
      pressed = false;
      settleSoon();
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(inner);
    target.addEventListener('scroll', onScroll as EventListener, { passive: true });
    wheelTarget.addEventListener('wheel', onWheel as EventListener, { passive: false });
    target.addEventListener('pointerdown', onPress as EventListener, { passive: true });
    window.addEventListener('pointerup', onRelease as EventListener, { passive: true });
    window.addEventListener('pointercancel', onRelease as EventListener, { passive: true });
    window.addEventListener('resize', schedule);
    scheduleRef.current = schedule;
    update();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(glide);
      window.clearTimeout(rest);
      observer.disconnect();
      target.removeEventListener('scroll', onScroll as EventListener);
      wheelTarget.removeEventListener('wheel', onWheel as EventListener);
      target.removeEventListener('pointerdown', onPress as EventListener);
      window.removeEventListener('pointerup', onRelease as EventListener);
      window.removeEventListener('pointercancel', onRelease as EventListener);
      window.removeEventListener('resize', schedule);
      scheduleRef.current = null;
    };
  }, [useWindowScroll, wheelContainerRef]);

  return (
    <div
      ref={rootRef}
      className={`scroll-stack ${useWindowScroll ? 'scroll-stack--window' : 'scroll-stack--contained'} ${className}`.trim()}
    >
      <div ref={innerRef} className="scroll-stack__inner">
        {items.map((child, index) => {
          const gap = itemDistance - (items.length - index) * itemStackDistance;
          return (
            <Fragment key={isValidElement(child) ? (child.key ?? index) : index}>
              {index > 0 && (
                <div aria-hidden="true" style={{ height: Math.max(0, gap), marginTop: Math.min(0, gap) }} />
              )}
              <div
                data-stack-slot=""
                className="scroll-stack__slot"
                style={{
                  top: `calc(${toLength(stackPosition)} + ${index * itemStackDistance}px)`,
                  marginBottom: (items.length - 1 - index) * itemStackDistance,
                  zIndex: index + 1
                }}
              >
                {child}
              </div>
            </Fragment>
          );
        })}
        <div ref={endRef} className="scroll-stack__end" aria-hidden="true" />
      </div>
    </div>
  );
};

export default ScrollStack;
