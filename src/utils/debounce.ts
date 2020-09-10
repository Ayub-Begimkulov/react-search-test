import { AnyFunction } from "types";
import { isNumber } from "./is-number";

interface DebouncedFunction<T extends AnyFunction> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

export function debounce<T extends AnyFunction>(ms: number, fn: T) {
  let timeoutId: number | null = null;
  const cancel = () => isNumber(timeoutId) && clearTimeout(timeoutId);
  const debounced: DebouncedFunction<T> = function (...args) {
    cancel();
    timeoutId = window.setTimeout(() => {
      fn.apply(null, args);
      timeoutId = null;
    }, ms);
  };
  debounced.cancel = cancel;
  return debounced;
}
