// app/(drawer)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { DrawerItemList } from "@react-navigation/drawer";
import { usePalette } from "@/constants/colors";
import { useContext } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Box } from '@/components/ui/box';
import { Feather } from "@expo/vector-icons";
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { OracleOrb } from '@/components/oracle-orb/oracle-orb';
import { ThemeContext } from '@/context/theme-context';

export default function DrawerLayout() {
  const p = usePalette();
  const { colorMode, setColorMode } = useContext(ThemeContext);
  const { width } = useWindowDimensions()
  const isLargeScreen = width >= 1024;

  return (
    <Drawer
      drawerContent={(props) => (
        <View style={{ flex: 1, backgroundColor: p.background, padding: 20, marginTop: 20 }}>
          <View className='mt-2 flex-row items-center px-5 gap-4'>
            <OracleOrb size={44} />
            <Text style={{ 
              color: p.textPrimary, 
              fontSize: 22, 
              fontWeight: '600',
              fontFamily: 'Georgia' }}>Oracle</Text>
          </View>
          <DrawerItemList {...props} />
          
          <Box className="mt-auto border-t border-white/40 pt-6">
            <Button variant='outline'
              onPress={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
              className='w-auto'
              style={{ backgroundColor: p.background, borderRadius: 99 }}>
              <Feather name={colorMode === 'light' ? 'sun' : 'moon'} size={18} color={p.textPrimary} />
            </Button>
          </Box>
        </View>
      )}
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: { backgroundColor: p.background },
        headerStyle: { backgroundColor: p.background },
        headerTintColor: p.textPrimary,
        headerShown: !isLargeScreen,
        drawerActiveBackgroundColor: p.accentDim,
        drawerActiveTintColor: p.accentPrimary,
        drawerInactiveTintColor: p.textSecondary,
        drawerLabelStyle: {
          fontFamily: 'system-ui',
          fontSize: 15,
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'New Chat',
          title: 'Oracle',
          drawerIcon: ({ color }) => <Feather name="edit-3" size={20} color={color} className='p-2' />,
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          drawerLabel: 'Explore',
          title: 'Explore',
          drawerIcon: ({ color }) => <Feather name="compass" size={20} color={color} className='p-2' />,
        }}
      />
    </Drawer>
  );
}