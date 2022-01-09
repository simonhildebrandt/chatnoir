import React, { useState, useCallback, useRef } from 'react';

export default function useTrigger({initialValue = false, delay = 1000}) {
  const [value, setValue] = useState(initialValue);
  const timeoutId = useRef(null);

  const trigger = useCallback(() => {
    if (timeoutId.current) clearTimeout(timeoutId.current);

    setValue(!initialValue);

    timeoutId.current = setTimeout(() => setValue(initialValue), delay);
  });

  return [value, trigger];
}
