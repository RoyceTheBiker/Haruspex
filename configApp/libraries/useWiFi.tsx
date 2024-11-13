import { PermissionsAndroid } from "react-native";


export default function useWiFi() {
    const wifiPermission = async () => { 
        const grantedLocation = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Wifi networks",
                message: "We need your permission in order to find wifi networks",
                buttonPositive: "OK",
            }
        )
        if (grantedLocation === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Wi-Fi permission granted");
        } else {
            console.log("You will not able to retrieve wifi available networks list");
        }
    }
    wifiPermission();

  
}