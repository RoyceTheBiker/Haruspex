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
    const [wifiSsids, setWifiSsids] = useState([]);
    const [wlanSSIDs, setWlanSSIDs] = useState<WlanT[]>([]);
    const [defaultSSID, setDefaultSSID] = useState('');
    
    WifiManager.getCurrentWifiSSID().then( (ssid) => {
        console.log('Default %s', ssid);
        setDefaultSSID(ssid);
    });

    const isDuplicte = (wlans: string[], nextWlan: string) =>
        wlans.findIndex((wlan) => nextWlan === wlan) > -1;
    
    const getWifiList = async() => {
        // let isWifiEnabled = await WifiManager.isEnabled;
        // if(isWifiEnabled) {
        //     console.log('wifi is enabled');
        // } else {
        //     console.log('wifi seems to be off');
        // }
        let wlanId = 0;
        //let wifiStringList = 
        await WifiManager.loadWifiList().then( (wlans) => {
            wlans.map( (wL) => {
                console.log('What is this thing %s', JSON.stringify(wL.SSID));
                setWifiSsids((prevState: string[]) => {
                    console.log('wlan.SSID %s', wL.SSID);
                    // console.log('indexOf hidden %d', wlan.SSID.indexOf('(hidden SSID)'));
                    if ((!isDuplicte(prevState, wL.SSID)) && (wL.SSID.indexOf('(hidden SSID)') < 0) ) {
                    //   console.log('Found device %s', wlan.SSID);
                    return [...prevState, wL.SSID];
                    }
                    return prevState;
                });
            });
        });
    };
    let ssidCount = 0;
    let scanCount = 0;

    // This page is constantly refreshing causing the Wi-Fi scan to run many, many times.
    // It slows down the program when the scan is constanly being ran.
    // This only runs the scan if there are no VLANs in the list.
    // if(wlanSSIDs.length === 0) {
        getWifiList().then( () => {
            wifiSsids.map( (wlan) => {
                setWlanSSIDs( (prevState: WlanT[]) => {
                    console.log('scan count %d %s', scanCount++, wlan);
                    if(prevState.findIndex(w => w.label === wlan) < 0) {
                        return [...prevState, {id: ssidCount++, label: wlan, current: wlan === defaultSSID ? true : false}];
                    } else {
                        return prevState;
                    }
                })
                // console.log('WLAN %s', wlan);
            });
        });
    // }
  
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
                            data={wlanSSIDs} 
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
    