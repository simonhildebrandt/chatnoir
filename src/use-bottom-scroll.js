import { useRef, useState, useLayoutEffect, useCallback } from 'react';

import { throttle } from 'throttle-debounce';


function useBottomScroll() {
  const scrollEndRef = useRef(null);
  const scrollableRef = useRef(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const scrollToBottom = () => {
    scrollEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useLayoutEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.addEventListener('scroll', handleScroll);
      scrollToBottom();
      return () => scrollableRef.current.removeEventListener('scroll', handleScroll)
    }
  })

  const handleScroll = useCallback(throttle(200, event => {
    const { target } = event;
    const position = event.target.getBoundingClientRect()
    setScrolledToBottom(position.height + target.scrollTop == target.scrollHeight);
  }));

  return {scrollEndRef, scrollableRef, scrollToBottom, scrolledToBottom};
}


export default useBottomScroll;
