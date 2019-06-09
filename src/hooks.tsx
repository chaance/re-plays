import React from 'react';

/**
 * Store a component's previous value in a ref for use after the value changes.
 */
export function usePrevious(value: any): any {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
