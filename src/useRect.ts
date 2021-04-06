import { useCallback, useEffect, useRef, useState } from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
import { DEFAULT_OPTIONS, DEFAULT_RECT } from './defaults';
import { Options, Rect, Result } from './types';
import {
  areRectsNotEqual,
  getElementRect,
  listenToWindow,
  useIsomorphicLayoutEffect,
  doesEventTargetContainElement
} from './utils';

export function useRect(options: Options = {}): Result {
  const { scroll, transitionEnd } = { ...DEFAULT_OPTIONS, ...options };

  const [rect, setRect] = useState<Rect>(DEFAULT_RECT);
  const [element, setElement] = useState<Element | null>(null);

  const update = useCallback(() => {
    if (!element) {
      setRect(DEFAULT_RECT);
      return;
    }

    const nextRect = getElementRect(element);

    if (areRectsNotEqual(rect, nextRect)) {
      setRect(nextRect);
    }
  }, [element, rect]);

  useIsomorphicLayoutEffect(update);

  // wrap the update function into a ref
  // to avoid frequent events re-subscriptions
  const updateRef = useRef(update);
  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    return listenToWindow('resize', () => updateRef.current());
  }, []);

  useEffect(() => {
    if (!scroll) {
      return;
    }

    return listenToWindow('scroll', ({ target }) => {
      if (element && doesEventTargetContainElement(target, element)) {
        updateRef.current();
      }
    });
  }, [scroll, element]);

  useEffect(() => {
    if (!transitionEnd) {
      return;
    }

    return listenToWindow('transitionend', ({ target }) => {
      if (
        element &&
        (target === element || doesEventTargetContainElement(target, element))
      ) {
        updateRef.current();
      }
    });
  }, [transitionEnd, element]);

  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => updateRef.current());
    observer.observe(element);

    return () => observer.disconnect();
  }, [element]);

  return [setElement, rect];
}
