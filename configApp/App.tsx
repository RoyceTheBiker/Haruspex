import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { Stack } from './routes/appStack'
import Bluetooth from './screens/Bluetooth';
import WifiScreen from './screens/WifiScreen';
import useWiFi from './libraries/useWiFi';

export default function App() {
  useWiFi();
  return (
    <NavigationContainer
      children={
        <Stack.Navigator initialRouteName="Bluetooth">
          <Stack.Screen name="Select Bluetooth Device" component={Bluetooth} />
          <Stack.Screen name="Wi-Fi Setup" component={WifiScreen} />
        </Stack.Navigator>
      }
    />
  );
}


