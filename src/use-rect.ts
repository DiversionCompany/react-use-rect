import { useRef, useEffect, useCallback, useLayoutEffect } from 'react';

export interface UseRect {
  (dispatchChange: DispatchChange, options?: Options): Result;
}

export interface Rect {
  bottom: number;
  height: number;
  scrollHeight: number;
  left: number;
  right: number;
  top: number;
  width: number;
  scrollWidth: number;
  x: number;
  y: number;
}

export interface DispatchChange {
  (rect: Rect): void;
}
export interface Options {
  resize?: boolean;
}

export type Result = [SetElement, Revalidate];

export interface SetElement {
  (element: Element | null): void;
}

export interface Revalidate {
  (options?: RevalidateOptions): void;
}

export interface RevalidateOptions {
  force?: boolean;
}

export function useRect(
  dispatchChange: DispatchChange,
  { resize = false }: Options = {}
): Result {
  const dispatchChangeRef = useRef(dispatchChange);
  useEffect(() => {
    dispatchChangeRef.current = dispatchChange;
  }, [dispatchChange]);

  const resizeRef = useRef(resize);
  useEffect(() => {
    resizeRef.current = resize;
    setupResizeObserver();
  }, [resize]);

  const elementRef = useRef<Element | null>(null);
  const setElement = useCallback((element: Element | null) => {
    if (element === elementRef.current) {
      return;
    }

    elementRef.current = element;
    revalidate();
    setupResizeObserver();
  }, []);

  const rectRef = useRef<Rect | null>(null);
  const revalidate = useCallback(
    ({ force = false }: RevalidateOptions = {}) => {
      if (!elementRef.current) {
        return;
      }

      const { scrollHeight, scrollWidth } = elementRef.current;
      const nextRect = {
        ...elementRef.current.getBoundingClientRect(),
        scrollHeight,
        scrollWidth
      };

      if (force || shouldDispatchRectChange(rectRef.current, nextRect)) {
        rectRef.current = nextRect;
        const { bottom, height, left, right, top, width, x, y } = nextRect;

        dispatchChangeRef.current({
          bottom,
          height,
          scrollHeight,
          left,
          right,
          top,
          width,
          scrollWidth,
          x,
          y
        });
      }
    },
    []
  );

  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const setupResizeObserver = useCallback(() => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    if (elementRef.current && resizeRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => revalidate());
      resizeObserverRef.current.observe(elementRef.current);
    }
  }, []);

  useIsomorphicLayoutEffect(revalidate);

  return [setElement, revalidate];
}

const RECT_KEYS = [
  'bottom',
  'height',
  'scrollHeight',
  'left',
  'right',
  'top',
  'width',
  'scrollWidth',
  'x',
  'y'
] as const;

function shouldDispatchRectChange(rect: Rect | null, nextRect: Rect) {
  return (
    !rect ||
    (rect !== nextRect && RECT_KEYS.some((key) => rect[key] !== nextRect[key]))
  );
}

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
