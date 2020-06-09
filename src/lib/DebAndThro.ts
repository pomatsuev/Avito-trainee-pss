/**
 * the function will be called one time and will ignore other calls until the timeout end
 * @param {()=>T} fn function to be wrapped
 * @param {number} timeout delay ms
 * @param {boolean} immediate if <true> then function start in first call
 * @param {C} context  if we need save <this> context
 *
 * @template T - generic - function return type
 * @template C - generic - type of context
 */
export function debounce<T = any, C = any>(
  fn: (...args: any[]) => T,
  timeout: number = 100,
  immediate: boolean = false,
  context: C | null = null
) {
  let timer: NodeJS.Timeout | null;
  return function (...args: any[]) {
    function later() {
      timer && clearTimeout(timer);
      timer = null;
      if (!immediate) return fn.apply<C | null, any[], T>(context, args);
    }
    const now = immediate && !timer;
    timer && clearTimeout(timer);
    timer = setTimeout(later, timeout);
    if (now) return fn.apply<C | null, any[], T>(context, args);
  };
}

/**
 * function will be called each count of timeout, other calls will be ignored
 * @param {()=>T} fn function to be wrapped
 * @param {number} timeout dalay ms
 * @param {C} context if we need save <this> context
 *
 * @template T - generic - function return type
 * @template C - generic - type of context
 */
export function throttle<T = any, C = any>(
  fn: (...args: any[]) => T,
  timeout: number = 200,
  context: C | null = null
) {
  let lastCall: number;
  return function (...args: any[]) {
    const prevCall = lastCall;
    const now = performance.now();
    if (!prevCall || now - prevCall >= timeout) {
      lastCall = now;
      return fn.apply<C | null, any[], T>(context, args);
    }
  };
}
