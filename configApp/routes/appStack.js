import { createStackNavigator } from 'react-navigation-stack';
// import { createAppContainer } from 'react-navigation-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Bluetooth from '../screens/Bluetooth';
import WifiScreen from '../screens/WifiScreen';

const screens = {
    Bluetooth: {
        screen: Bluetooth
    },
    WifiScreen: {
        screen: WifiScreen
    }
}

export const Stack = createNativeStackNavigator();
