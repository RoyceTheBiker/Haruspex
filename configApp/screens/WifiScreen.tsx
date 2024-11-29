import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from '../styles/globalStyles';
import { Alert, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { Asset } from 'expo-asset';
import { initBluetooth, getData, connectToDevice } from '../libraries/bluetoothComs';
import { Esp32ConfT } from '../models/esp32Conf';

type WlanT = {
    id: number,
    label: string,
    current: boolean
}

export default function WifiScreen({navitation, route}) {
    const [wifiSsids, setWifiSsids] = useState<WlanT[]>([]);
    const [defaultSSID, setDefaultSSID] = useState('');
    const [webType, setWebType] = useState('');
    const [esp32Hostname, setEsp32Hostname] = useState(route.params.name);
    const [esp32SSID, setEsp32SSID] = useState<string>();
    const [esp32PasswdIsSet, setesp32PasswdIsSet] = useState(false);
    const [esp32NewPasswd, setEsp32NewPasswd] = useState('');
    const [esp32Cdn, setEsp32Cdn] = useState('http://localhost:8081');
    const [changePassPlaceholder, setChangePassPlaceholder] = useState('password');
    const [selectedSSID, setSelectedSSID] = useState('');
    const [ipAddress, setIpAddress] = useState('');

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
                        // console.log('Found device %s', wL.SSID);
                        // console.log('esp32SSID is %s', esp32SSID);
                        // console.log('default is %s', defaultSSID);
                        let newEntry = {
                            id: ssidCount++, 
                            label: wL.SSID,
                            current: wL.SSID === (esp32SSID ? esp32SSID : defaultSSID) ? true : false
                        } as WlanT;
                        setSelectedSSID(esp32SSID ? esp32SSID : defaultSSID);
                        // console.log('New WlanT %s', JSON.stringify(newEntry));
                        return [...prevState, newEntry];
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
        

        if(!defaultSSID) {
            WifiManager.getCurrentWifiSSID().then( (ssid) => {
                // console.log('Default %s', ssid);
                setDefaultSSID(ssid);
                if(selectedSSID.length === 0) {
                    setSelectedSSID(ssid);
                }
            });
        } else {
            if(!esp32SSID) {
                initBluetooth(route.params.name).then( (message) => {
                    console.log('BT message %s', message);
                    connectToDevice(esp32Hostname).then( (message: string) => {
                        console.log('Message from BTLE %s', message);
                        getData("GET config").then( (response: Esp32ConfT) => {
                            console.log('Got BLE responce');
                            // let respJ = JSON.parse(response) as Esp32ConfT;
                            setEsp32Hostname(response.esp32Hostname);
                            if(response.esp32SSID.length > 0) {
                                setEsp32SSID(response.esp32SSID);
                            }
                            setesp32PasswdIsSet(response.esp32PasswdSet);
                            if(response.esp32PasswdSet === true) {
                                setChangePassPlaceholder('change password');
                            }
                            setEsp32Cdn(response.esp32Cdn);
                            setWebType(response.webType);
                            // setIpAddress(response.ipAddress);
                            setIpAddress('192.168.0.3');
                        });
                        
                    });
                });
            } else {
                getWifiList();
            }
        }
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
                        onChangeText={setEsp32Hostname}
                        value={esp32Hostname}          
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
                            value={selectedSSID} 
                            valueField="label"
                            placeholder={'Select from ' + wifiSsids.length + ' SSIDs'}
                            onChange={(item) => setEsp32SSID(item.label)}
                            />
                    </View>
                
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Wi-Fi Password</Text>
                        <TextInput
                        style={styles.input}
                        onChangeText={setEsp32NewPasswd}
                        secureTextEntry={true}
                        placeholder={changePassPlaceholder} 
                        value={esp32NewPasswd}         
                        />
                    </View>
                
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>CDN URL</Text>
                        <TextInput
                        style={styles.input}
                        onChangeText={setEsp32Cdn}            
                        value={esp32Cdn}
                        />
                    </View>
                
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Web Type</Text>
                        <TextInput
                        style={styles.input}
                        onChangeText={setWebType}            
                        value={webType}
                        />
                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.button} activeOpacity={5}>
                            <Text onPress={() => Alert.alert('Saved')}>
                            Save Settings
                            </Text>
                        </TouchableOpacity>
                        {ipAddress &&
                        <TouchableOpacity style={styles.openButton} activeOpacity={5}>
                            <Text onPress={() => Alert.alert('Go open')}>
                            Open
                            </Text>
                        </TouchableOpacity> }
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
    