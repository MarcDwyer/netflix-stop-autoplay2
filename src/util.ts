export const debounce = (
  func: Function,
  dur: number
): EventListenerOrEventListenerObject => {
  let timer: number | undefined;
  return function () {
    const ctx = this,
      args = arguments;

    clearTimeout(timer);

    //@ts-ignore
    timer = setTimeout(() => {
      func.apply(ctx, args);
    }, dur);
  };
};

export function getKey<T>(k: string): T {
  //@ts-ignore
  return chrome.storage.sync.get([k], (v) => v) as T;
}
