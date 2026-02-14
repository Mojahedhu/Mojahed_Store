import { useEffect, useRef, useState } from "react";

export const useAutoHeight = (isOpen: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (!ref.current) return;

    if (isOpen) {
      setMaxHeight(`${ref.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  return { ref, style: { maxHeight } };
};
