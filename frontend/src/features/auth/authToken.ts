// Auth token getter - set once by AuthBridge component
let getter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: typeof getter): void => {
  getter = fn;
};

export const readToken = (): Promise<string | null> =>
  getter ? getter() : Promise.resolve(null);
