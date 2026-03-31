import { createContext, useContext, useState, type ReactNode } from "react";

export type PrototypeVersion = "A" | "B";

interface VersionContextValue {
  version: PrototypeVersion;
  setVersion: (v: PrototypeVersion) => void;
}

const VersionContext = createContext<VersionContextValue>({
  version: "A",
  setVersion: () => {},
});

const STORAGE_KEY = "prototype-version";

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<PrototypeVersion>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "B" ? "B" : "A";
  });

  const setVersion = (v: PrototypeVersion) => {
    localStorage.setItem(STORAGE_KEY, v);
    setVersionState(v);
  };

  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  return useContext(VersionContext);
}
