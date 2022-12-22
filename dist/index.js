"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useRect: () => useRect,
  useWindowOn: () => useWindowOn
});
module.exports = __toCommonJS(src_exports);

// src/use-rect.ts
var import_react = require("react");
function useRect(dispatchChange, { resize = false } = {}) {
  const dispatchChangeRef = (0, import_react.useRef)(dispatchChange);
  (0, import_react.useEffect)(() => {
    dispatchChangeRef.current = dispatchChange;
  }, [dispatchChange]);
  const resizeRef = (0, import_react.useRef)(resize);
  (0, import_react.useEffect)(() => {
    resizeRef.current = resize;
    setupResizeObserver();
  }, [resize]);
  const elementRef = (0, import_react.useRef)(null);
  const setElement = (0, import_react.useCallback)((element) => {
    if (element === elementRef.current) {
      return;
    }
    elementRef.current = element;
    revalidate();
    setupResizeObserver();
  }, []);
  const rectRef = (0, import_react.useRef)(null);
  const revalidate = (0, import_react.useCallback)(
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
  const resizeObserverRef = (0, import_react.useRef)(null);
  const setupResizeObserver = (0, import_react.useCallback)(() => {
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
var useIsomorphicLayoutEffect = typeof window === "undefined" ? import_react.useEffect : import_react.useLayoutEffect;

// src/use-window-on.ts
var import_react2 = require("react");
function useWindowOn(eventType, callback) {
  const callbackRef = (0, import_react2.useRef)(callback);
  (0, import_react2.useEffect)(() => {
    callbackRef.current = callback;
  });
  (0, import_react2.useEffect)(() => {
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
