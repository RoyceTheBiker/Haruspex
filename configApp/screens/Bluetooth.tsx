import { styles } from '../styles/globalStyles';
import React, { useState } from 'react';
import { NativeEventEmitter, NativeModules, Text, TouchableOpacity, View } from 'react-native';
import useBLE from '../libraries/useBLE';
import { BleManager } from 'react-native-ble-plx';

const data = [
    {
      id: 0,
      name: 'Apple',
      cost: '$1'
    }, 
    {
      id: 1,
      name: 'Bacon',
      cost: '$10'
    },
    {
      id: 2,
      name: 'Cantaloupe',
      cost: '$7.50'
    }, 
    {
      id: 3,
      name: 'Donut',
      cost: '$2'
    },
    {
      id: 4,
      name: 'Fish',
      cost: '$5'
    }];

    

function renderRow(btDevice, connectToDevice) {
    return (
        <View style={styles.tableRow} key={btDevice.id}>
            <View style={styles.tableCell}>
                <Text style={styles.cellText}>{btDevice.name}</Text>
            </View> 
            <View style={styles.tableCell}>
                <Text style={styles.cellText}>{btDevice.cost}</Text>
            </View> 
            <View style={styles.buttonCell}>
                <TouchableOpacity style={styles.connectButton}>
                <Text onPress={() => connectToDevice(btDevice.name)}>
                Connect
                </Text>
            </TouchableOpacity>
            
            </View> 
        </View>
    );
}

const connectToDevice = () => {
  
  // call the navigator to move to the wi-fi screen
}

export default function Bluetooth(navigation) {
  useBLE();
  const bleManager = new BleManager();
    
  // react-native-ble-manager was removed because Expo does not support AndroidManifest
  // BleManager.start({ showAlert: false }).then(() => {
  //   // Success code
  //   console.log("Module initialized");
  
  //   enableBluetooth();
  //   startScan();
  // });
  // const connectToDevice = (deviceName) => {
  //   // lookup device by name
  //   togglePeripheralConnection(item);
  //   navigation.navigate('Wi-Fi Setup', {name: btDevice.name});
  // }

  return (
    <View style={styles.tableContainer}>
        <View>
        <Text style={styles.titleBar}>Haruspex configuration app</Text>
        </View>    
        <View style={styles.table}>
        {
        data.map((dataRow) => { 
            return renderRow(dataRow, connectToDevice);
        })
        }
        </View>
    </View>
    );   
}
 