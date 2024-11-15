import { styles } from '../styles/globalStyles';
import React, { useState } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { Asset } from 'expo-asset';
import bluetoothPermissions from '../libraries/bluetoothPermissions';

function renderRow(btDevice, connectToDevice, navigation) {
  console.log('BT render row %s', btDevice);
  return (
    <View style={styles.tableRow} key={btDevice.id}>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{btDevice.name}</Text>
      </View>
      <View style={styles.buttonCell}>
        <TouchableOpacity style={styles.connectButton} activeOpacity={1}>
          <Text onPress={() => connectToDevice(btDevice.name, navigation)}>
            Connect
          </Text>
        </TouchableOpacity>
      </View> 
    </View>
  );
}

const connectToDevice = (deviceName, {navigation}) => {
  console.log('Wi-Fi Setup for %s', deviceName);
  navigation.navigate('Wi-Fi Setup', {name: deviceName});
  // call the navigator to move to the wi-fi screen
}

export default function Bluetooth(navigation) {
  bluetoothPermissions();

  const [allDevices, setAllDevices] = useState<string[]>([]);

  const isDuplicteDevice = (devices: string[], nextDevice: string) =>
    devices.findIndex((device) => nextDevice === device) > -1;

  if(allDevices.length === 0) {
    const bleManager = new BleManager();
    
    if(bleManager) {
      console.log('Ready to use BLE');
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('Device scan error %s', error.message);
        } else {
          if(device && (device.localName || device.name)) {
            setAllDevices((prevState: string[]) => {
              if (!isDuplicteDevice(prevState, device.name)) {
                console.log('Found device %s', device.name);
                return [...prevState, device.name];
              }
              return prevState;
            });
          }
        }
      });
    }
    bleManager.state().then( (bleState: State) => {
      console.log('BLE State is %s', bleState);
      if(bleState === 'Unsupported') {
        // For debugging the screen layouts in Expres Go and AVD
        console.log('No BLE device');
        setAllDevices( (prevState: string[]) => {
          return [...prevState, 'Fake 1']
        });
        setAllDevices( (prevState: string[]) => {
          return [...prevState, 'Fake 2']
        });
        setAllDevices( (prevState: string[]) => {
          return [...prevState, 'Fake 3']
        });
      }
    });
  }

  let idCounter = 0;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{uri: Asset.fromModule(require("../assets/background.png")).uri,
        }}>
        <View style={styles.container}>
          <Text style={styles.titleBar}>Haruspex</Text>
            <View style={styles.table}>
            {
              allDevices.map( (device) => { 
                  return renderRow(
                    {id: idCounter++, 
                      name: device} , connectToDevice, navigation);
              })
            }
          </View>    
        </View>
      </ImageBackground>
    </View>
    );   
}
 