import { useEffect, useRef, useState } from "react";

export const useInfiniteScrollObserver = () => {
  const refTarget = useRef<HTMLDivElement>(null);
  const [isIntersected, setIsIntersected] = useState(false);

  useEffect(() => {
    if (refTarget.current === null) return;
    const callback = (data: IntersectionObserverEntry[]) => {
      setIsIntersected(data[0].isIntersecting);
    };
    const observer = new IntersectionObserver(callback, {
      root: null,
      threshold: 1,
      rootMargin: "0px",
    });
    observer.observe(refTarget.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    refTarget,
    isIntersected,
  };
};
