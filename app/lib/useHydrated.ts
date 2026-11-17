import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// False while prerendering and during hydration, true after. Anything that depends on the
// visitor's clock or randomness renders only once this is true, so the prerendered HTML and
// the first client render always match.
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
