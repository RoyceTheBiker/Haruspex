import { styles } from '../styles/globalStyles';
import React, { useState } from 'react';
import { NativeEventEmitter, NativeModules, Text, TouchableOpacity, View } from 'react-native';
import useBLE from '../libraries/useBLE';
import { BleManager, Device } from 'react-native-ble-plx';
// import { Navigation } from 'react-native-navigation';

function renderRow(btDevice, connectToDevice, navigation) {
    return (
        <View style={styles.tableRow} key={btDevice.id}>
            <View style={styles.tableCell}>
                <Text style={styles.cellText}>{btDevice.name}</Text>
            </View> 
            {/* <View style={styles.tableCell}>
                <Text style={styles.cellText}>{btDevice.cost}</Text>
            </View>  */}
            <View style={styles.buttonCell}>
                <TouchableOpacity style={styles.connectButton}>
                <Text onPress={() => connectToDevice(btDevice.name, navigation)}>
                Connect
                </Text>
            </TouchableOpacity>
            
            </View> 
        </View>
    );
}

const connectToDevice = (deviceName, {navigation}) => {
  navigation.navigate('Wi-Fi Setup', {name: deviceName});
  // call the navigator to move to the wi-fi screen
}

export default function Bluetooth(navigation) {
  const [allDevices, setAllDevices] = useState<Device[]>([]);

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  useBLE();
  console.log('Ready to use BLE');
  const bleManager = new BleManager();
  if(bleManager) {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Device scan error %s', error.message);
      } else {
        if(device && (device.localName || device.name)) {
          setAllDevices((prevState: Device[]) => {
            if (!isDuplicteDevice(prevState, device)) {
              console.log('Found device %s', device.name);
              return [...prevState, device];
            }
            return prevState;
          });
        }
      }
    });
  } else {
    console.log('No BLE device');
  }

  let idCounter = 0;
  return (
    <View style={styles.tableContainer}>
        <View>
        <Text style={styles.titleBar}>Haruspex configuration app</Text>
        </View>    
        <View style={styles.table}>
        {
          allDevices.map( (device) => { 
              return renderRow(
                {id: idCounter++, 
                  name: device.name} , connectToDevice, navigation);
          })
        }
        </View>
    </View>
    );   
}
 