import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { Stack } from './routes/appStack'
import Bluetooth from './screens/Bluetooth';
import WifiSetup from './screens/WifiSetup';

export default function App() {
  
  return (
    <NavigationContainer
      children={
        <Stack.Navigator initialRouteName="WifiSetup">
          <Stack.Screen name="Select Bluetooth Device" component={Bluetooth} />
          <Stack.Screen name="Wi-Fi Setup" component={WifiSetup} />
        </Stack.Navigator>
      }
    />
  );
}


