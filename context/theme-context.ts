import { createContext } from 'react';

export const ThemeContext = createContext<{
  colorMode: 'light' | 'dark';
  setColorMode: (mode: 'light' | 'dark') => void;
}>({ colorMode: 'light', setColorMode: () => {} });