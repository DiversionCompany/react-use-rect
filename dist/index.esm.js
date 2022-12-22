var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/use-rect.ts
import { useRef, useEffect, useCallback, useLayoutEffect } from "react";
function useRect(dispatchChange, { resize = false } = {}) {
  const dispatchChangeRef = useRef(dispatchChange);
  useEffect(() => {
    dispatchChangeRef.current = dispatchChange;
  }, [dispatchChange]);
  const resizeRef = useRef(resize);
  useEffect(() => {
    resizeRef.current = resize;
    setupResizeObserver();
  }, [resize]);
  const elementRef = useRef(null);
  const setElement = useCallback((element) => {
    if (element === elementRef.current) {
      return;
    }
    elementRef.current = element;
    revalidate();
    setupResizeObserver();
  }, []);
  const rectRef = useRef(null);
  const revalidate = useCallback(
    ({ force = false } = {}) => {
      if (!elementRef.current) {
        return;
      }
      const { scrollHeight, scrollWidth } = elementRef.current;
      const nextRect = __spreadProps(__spreadValues({}, elementRef.current.getBoundingClientRect()), {
        scrollHeight,
        scrollWidth
      });
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
  const resizeObserverRef = useRef(null);
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
var RECT_KEYS = [
  "bottom",
  "height",
  "scrollHeight",
  "left",
  "right",
  "top",
  "width",
  "scrollWidth",
  "x",
  "y"
];
function shouldDispatchRectChange(rect, nextRect) {
  return !rect || rect !== nextRect && RECT_KEYS.some((key) => rect[key] !== nextRect[key]);
}
var useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// src/use-window-on.ts
import { useEffect as useEffect2, useRef as useRef2 } from "react";
function useWindowOn(eventType, callback) {
  const callbackRef = useRef2(callback);
  useEffect2(() => {
    callbackRef.current = callback;
  });
  useEffect2(() => {
    if (typeof window === void 0) {
      return void 0;
    }
    const listener = (event) => {
      callbackRef.current(event);
    };
    const options = {
      capture: true,
      passive: true
    };
    window.addEventListener(eventType, listener, options);
    return () => {
      window.removeEventListener(eventType, listener, options);
    };
  }, [eventType]);
}
export {
  useRect,
  useWindowOn
};
