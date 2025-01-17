import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
};

export const useClickOutside = <T extends HTMLElement>(
  handler: () => void
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && event.target) {
        if (!ref.current.contains(event.target as Node)) {
          handler();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return ref;
};

export const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  enabled: boolean
) => {
  useEffect(() => {
    if (textAreaRef && enabled) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = `${scrollHeight.toString()}px`;
    }
  }, [textAreaRef, value]);
};

export function useLockBody() {
  useLayoutEffect((): (() => void) => {
    const originalStyle: string = window.getComputedStyle(
      document.body
    ).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useLayoutEffect(() => {
    handleSize();

    window.addEventListener("resize", handleSize);

    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, []);

  return windowSize;
};

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay ?? 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export type PortalElement = {
  id: string;
  element: React.ReactPortal;
};

export const usePortal = () => {
  const [portals, setPortals] = useState<PortalElement[]>([]);

  const addPortal = useCallback(
    (children: React.ReactNode, container: Element) => {
      const id = Math.random().toString(36).slice(2, 9);
      const portal = createPortal(children, container);
      setPortals((prev) => [...prev, { id, element: portal }]);

      return id;
    },
    []
  );

  const removePortals = useCallback(() => {
    setPortals([]);
  }, []);

  const removePortal = useCallback((id: string) => {
    setPortals((prev) => prev.filter((portal) => portal.id !== id));
  }, []);

  return { portals, addPortal, removePortal, removePortals };
};

const MOBILE_BREAKPOINT = 768;

const getScreenIssue = () => {
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    return "mobile";
  }
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    return "resize";
  }
  return undefined;
};

// Determines if an issue with the screen is detected.
// Returns "mobile" if the device is a mobile device,
// "resize" if the window is too small, and undefined
// if there is no issue.
export const useScreenIssue = () => {
  const [screenIssue, setScreenIssue] = useState<string | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${(MOBILE_BREAKPOINT - 1).toString()}px)`
    );
    const onChange = () => {
      setScreenIssue(getScreenIssue());
    };
    mql.addEventListener("change", onChange);
    setScreenIssue(getScreenIssue());
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return screenIssue;
};

export const useIsMobile = () => {
  const screenIssue = useScreenIssue();
  return screenIssue !== undefined;
};
