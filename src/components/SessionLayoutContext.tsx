import { createContext, useContext, useState } from "react";

const SessionLayoutContext = createContext<{
  simpleSessionLayout: boolean;
  setSimpleSessionLayout: (v: boolean) => void;
  chipSessionLayout: boolean;
  setChipSessionLayout: (v: boolean) => void;
}>({
  simpleSessionLayout: false,
  setSimpleSessionLayout: () => {},
  chipSessionLayout: false,
  setChipSessionLayout: () => {},
});

export function SessionLayoutProvider({ children }: { children: React.ReactNode }) {
  const [simpleSessionLayout, setSimpleSessionLayout] = useState(false);
  const [chipSessionLayout, setChipSessionLayout] = useState(false);
  return (
    <SessionLayoutContext.Provider value={{ simpleSessionLayout, setSimpleSessionLayout, chipSessionLayout, setChipSessionLayout }}>
      {children}
    </SessionLayoutContext.Provider>
  );
}

export function useSessionLayout() {
  return useContext(SessionLayoutContext);
}
