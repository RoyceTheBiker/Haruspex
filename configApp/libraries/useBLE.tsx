import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from 'expo-device';

export default function useBLE() {
    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                    title: "Location Permission",
                    message: "Bluetooth Low Energy requires Location",
                    buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                    title: "Location Permission",
                    message: "Bluetooth Low Energy requires Location",
                    buttonPositive: "OK",
            }
        );
    
        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };
    
    const requestPermissions = async () => {
        console.log('requestPermissions function');
        if (Platform.OS === "android") {
            console.log('requestPermissions Android');
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                console.log('requestPermissions older Android');
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Bluetooth Low Energy requires Location",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            
            } else {
                console.log('requestPermissions newer Android');
                const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
                return isAndroid31PermissionsGranted;
            }
        } else {
            return true;
        }
    };
    
    console.log('Device name ' + ExpoDevice.deviceName);
    console.log('Device brand ' + ExpoDevice.brand);
    console.log('Device type ' + ExpoDevice.deviceType);
    console.log('Device year class ' + ExpoDevice.deviceYearClass);
    
    requestPermissions();

}