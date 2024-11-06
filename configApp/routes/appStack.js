import { createStackNavigator } from 'react-navigation-stack';
// import { createAppContainer } from 'react-navigation-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Bluetooth from '../screens/Bluetooth';
import WifiSetup from '../screens/WifiSetup';

const screens = {
    Bluetooth: {
        screen: Bluetooth
    },
    WifiSetup: {
        screen: WifiSetup
    }
}

export const Stack = createNativeStackNavigator();
