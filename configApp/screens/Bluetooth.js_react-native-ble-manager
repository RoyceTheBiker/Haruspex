import { styles } from '../styles/globalStyles';
import React, { useState } from 'react';
import { NativeEventEmitter, NativeModules, Text, TouchableOpacity, View } from 'react-native';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
  PeripheralInfo,
} from 'react-native-ble-manager';

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS = [];
const ALLOW_DUPLICATES = true;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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
  
export default function Bluetooth(navigation) {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map(),
  );

  const startScan = () => {
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch((err) => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };
  
  const enableBluetooth = async () => {
    try {
      console.debug('[enableBluetooth]');
      await BleManager.enableBluetooth();
    } catch (error) {
      console.error('[enableBluetooth] thrown', error);
    }
  }
  
  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = (
    event, //: BleDisconnectPeripheralEvent,
  ) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
    setPeripherals(map => {
      let p = map.get(event.peripheral);
      if (p) {
        p.connected = false;
        return new Map(map.set(event.peripheral, p));
      }
      return map;
    });
  };

  const handleConnectPeripheral = (event) => {
    console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
  };

  const handleDiscoverPeripheral = (peripheral) => {
    console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    setPeripherals(map => {
      return new Map(map.set(peripheral.id, peripheral));
    });
  };

  const togglePeripheralConnection = async (peripheral) => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
      await connectPeripheral(peripheral);
    }
  };

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug(
        '[retrieveConnected]', connectedPeripherals.length, 'connectedPeripherals',
        connectedPeripherals,
      );

      for (let peripheral of connectedPeripherals) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  const retrieveServices = async () => {
    const peripheralInfos = [];
    for (let [peripheralId, peripheral] of peripherals) {
      if (peripheral.connected) {
        const newPeripheralInfo = await BleManager.retrieveServices(peripheralId);
        peripheralInfos.push(newPeripheralInfo);
      }
    }
    return peripheralInfos;
  };

  const readCharacteristics = async () => {
    let services = await retrieveServices();

    for (let peripheralInfo of services) {
      peripheralInfo.characteristics?.forEach(async c => {
        try {
          const value = await BleManager.read(peripheralInfo.id, c.service, c.characteristic);
          console.log("[readCharacteristics]", "peripheralId", peripheralInfo.id, "service", c.service, "char", c.characteristic, "\n\tvalue", value);
        } catch (error) {
          console.error("[readCharacteristics]", "Error reading characteristic", error);
        }
      });
    }
  }

  const getAssociatedPeripherals = async () => {
    try {
      const associatedPeripherals = await BleManager.getAssociatedPeripherals();
      console.debug(
        '[getAssociatedPeripherals] associatedPeripherals',
        associatedPeripherals,
      );

      for (let peripheral of associatedPeripherals) {
        setPeripherals(map => {
          return new Map(map.set(peripheral.id, peripheral));
        });
      }
    } catch (error) {
      console.error(
        '[getAssociatedPeripherals] unable to retrieve associated peripherals.',
        error,
      );
    }
  }

  const connectPeripheral = async (peripheral) => {
    try {
      if (peripheral) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

        if (peripheralData.characteristics) {
          for (let characteristic of peripheralData.characteristics) {
            if (characteristic.descriptors) {
              for (let descriptor of characteristic.descriptors) {
                try {
                  let data = await BleManager.readDescriptor(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                    descriptor.uuid,
                  );
                  console.debug(
                    `[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                    data,
                  );
                } catch (error) {
                  console.error(
                    `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                    error,
                  );
                }
              }
            }
          }
        }

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.rssi = rssi;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        navigation.navigate('PeripheralDetails', {
          peripheralData: peripheralData,
        });
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  BleManager.start({ showAlert: false }).then(() => {
    // Success code
    console.log("Module initialized");
  
    enableBluetooth();
    startScan();
  });
  const connectToDevice = (deviceName) => {
    // lookup device by name
    togglePeripheralConnection(item);
    navigation.navigate('Wi-Fi Setup', {name: btDevice.name});
  }

  return (
    <View style={styles.tableContainer}>
        <View>
        <Text style={styles.titleBar}>Haruspex configuration app</Text>
        </View>    
        <View style={styles.table}>
        {
        data.map((dataRow) => { 
            return renderRow(dataRow, navigation, connectToDevice);
        })
        }
        </View>
    </View>
    );   
}
 