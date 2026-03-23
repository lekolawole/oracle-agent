// app/_layout.tsx
import { useState } from 'react';
import { Slot } from 'expo-router';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useColorScheme } from 'react-native';
import { ThemeContext } from '@/context/theme-context';

export default function RootLayout() {
  const deviceScheme = useColorScheme();
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(deviceScheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      <GluestackUIProvider mode={colorMode}>
        {/* Slot or Stack will render the inner (drawer) layout */}
        <Slot />
      </GluestackUIProvider>
    </ThemeContext.Provider>
  );
}