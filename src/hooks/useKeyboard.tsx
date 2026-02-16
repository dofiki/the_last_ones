import { useEffect, useRef } from "react";

type KeyMap = {
  a: boolean;
  d: boolean;
  e: boolean;
  jump: boolean;
};

export function useKeyboard() {
  const keys = useRef<KeyMap>({
    a: false,
    d: false,
    e: false,
    jump: false,
  });

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      switch (e.key) {
        case "a":
          keys.current.a = true;
          break;
        case "d":
          keys.current.d = true;
          break;
        case "e":
          keys.current.e = true;
          break;
        case " ":
          keys.current.jump = true;
          break;
      }
    };

    const handleUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "a":
          keys.current.a = false;
          break;
        case "d":
          keys.current.d = false;
          break;
        case "e":
          keys.current.e = false;
          break;
        case " ":
          keys.current.jump = false;
          break;
      }
    };

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  return keys;
}
