import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from '../styles/globalStyles';
import { Alert, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { Asset } from 'expo-asset';

type WlanT = {
    id: number,
    label: string,
    current: boolean
}

export default function WifiScreen({navitation, route}) {
    const [wifiSsids, setWifiSsids] = useState<WlanT[]>([]);
    const [defaultSSID, setDefaultSSID] = useState('');
    
    const isDuplicte = (wlans: WlanT[], nextWlan: string) =>
        wlans.findIndex((wlan) => nextWlan === wlan.label) > -1;
    let ssidCount = 0;

    const getWifiList = async() => {
        // let isWifiEnabled = await WifiManager.isEnabled;
        // if(isWifiEnabled) {
        //     console.log('wifi is enabled');
        // } else {
        //     console.log('wifi seems to be off');
        // }
        let wlanId = 0;
        await WifiManager.loadWifiList().then( (wlans) => {
            wlans.map( (wL) => {
                setWifiSsids((prevState: WlanT[]) => {
                    if ((!isDuplicte(prevState, wL.SSID)) && (wL.SSID.indexOf('(hidden SSID)') < 0) ) {
                        console.log('Found device %s', wL.SSID);
                        return [...prevState,  {id: ssidCount++, label: wL.SSID, current: wL.SSID === defaultSSID ? true : false}];
                    }
                    return prevState;
                });
            });
        });
    };

    // This page is constantly refreshing causing the Wi-Fi scan to run many, many times.
    // It slows down the program when the scan is constanly being ran.
    // This only runs the scan if there are no VLANs in the list.
    if(wifiSsids.length === 0) {
        WifiManager.getCurrentWifiSSID().then( (ssid) => {
            console.log('Default %s', ssid);
            setDefaultSSID(ssid);
        });
    
        getWifiList();
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{uri: Asset.fromModule(require("../assets/background.png")).uri,
                }}>
                <View style={styles.container}>
                    <Text style={styles.titleBar}>Haruspex</Text>
                    {/* <!-- StatusBar style="auto" / --> */}
                
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Hostname</Text>
                        <TextInput
                        style={styles.input}
                        // onChangeText={onChangeText}
                        value={route.params.name}          
                        />
                    </View>
                
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Wi-Fi SSID</Text>
                        <Dropdown 
                            style={styles.dropdown}
                            
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            data={wifiSsids} 
                            labelField="label" 
                            value={defaultSSID} 
                            valueField="label"
                            onChange={(item) => alert('select ' + item.label)}/>
                    </View>
                
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Wi-Fi Password</Text>
                        <TextInput
                        style={styles.input}
                        // onChangeText={onChangeText}
                        secureTextEntry={true}
                        placeholder="password"          
                        />
                    </View>
                
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>CDN URL</Text>
                        <TextInput
                        style={styles.input}
                        // onChangeText={onChangeText}            
                        value='https://cdn.SiliconTao.com'          
                        />
                    </View>

                    <TouchableOpacity style={styles.button} activeOpacity={5}>
                        <Text onPress={() => Alert.alert('Saved')}>
                        Save Settings
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}
    