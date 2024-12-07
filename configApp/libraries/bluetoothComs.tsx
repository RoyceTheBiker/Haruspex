import { BleError, BleManager, Characteristic, Device, LogLevel, Service, State } from "react-native-ble-plx";
import { Esp32ConfT } from "../models/esp32Conf";
import Base64 from 'react-native-base64';
import { NativeModules } from "react-native";

let bleManager: BleManager;
let btDevice: Device;
let btServices: Array<Service>;
let writeChannel: Characteristic;

const WriteToESP32  = "f78f9b6c-c078-4ef1-af4f-b68c1df1af4e"

export const initBluetooth = (connectDevice: string): Promise<string> => {
    console.log('initBluetooth');
    return new Promise( (resolve) => {
        if(!bleManager) {
            console.log('Create new BLE manager');
            bleManager = new BleManager();
            if(bleManager) {
                bleManager.setLogLevel(LogLevel.Verbose);
                console.log('Start device scan');
                bleManager.startDeviceScan(null, null, (error, device) => {
                    if (error) {
                        console.log('Device scan error %s', error.message);
                    } else {
                        if((connectDevice === device.localName) || (connectDevice === device.name)) {
                            // console.log('BT Device is set');
                            btDevice = device;
                            resolve('Connected');
                        }
                    }
                });
            }
        }
    });
}

export const connectToDevice = (deviceName: string, navigation): Promise<string> => {
    console.log('Connecting to BT device %s', deviceName);
    return new Promise( (resolve) => {
        console.log('Call connect');
        btDevice.connect({requestMTU: 517}).catch(
            (reason:any) => {
                console.log('connect failed because %s', reason);
            }
        ).then( (device: Device) => {
            device?.onDisconnected( () => {
                console.log('device disconnected');
                bleManager.destroy().then( () => {
                    bleManager = null;
                    NativeModules.DevSettings.reload();
                    // navigation.navigate('Select Bluetooth Device');                    
                });
            });
            console.log('Discovering characteristics');
            return device?.discoverAllServicesAndCharacteristics();
        }).then( (device: Device) => {
            console.log('charactoristics discovered');
            return device?.services().catch( (error) => {
                console.error('no service to return');
                console.error(error);
            });
        }).catch( (error) => {
            console.error('device services did not return a promise');
            console.error(error);
        }).then( (services: Service[]) => {
            
            btServices = new Array<Service>;
            services?.forEach( (service) => {
                btServices.push(service);
                service.characteristics().then( (channels: Characteristic[]) => {
                    channels.forEach( (channel) => {
                        if(channel.uuid === WriteToESP32) {
                            console.log('write channel has write with response %s', 
                                channel.isWritableWithResponse ? 'true' : 'false');
                            writeChannel = channel;
                        }
                    });
                });
            });
            resolve('Connected');
        });
    });
}

export const sendMessage = (request: string): Promise<Esp32ConfT> => {
    console.log('Request: %s', request);
    return new Promise( (resolve) => {
        let replyConf = {
            esp32Hostname: 'Connection failed!',
            esp32PasswdSet: 'true',
            esp32SSID: 'Oops!',
            esp32Passwd: '',
            esp32Cdn: 'Close and restart app',
            webType: 'Is Bluetooth on?',
            ipAddress: '' } as Esp32ConfT;

        let returnMessage = JSON.stringify(replyConf);

        bleManager.state().then( (bleState: State) => {
            console.log('BLE State is %s', bleState);
            if((bleState === 'PoweredOn') && writeChannel) {
                console.log('Sending message to %s requesting %s', writeChannel.uuid, request);
        
                let requestB64 = Base64.encode(request);
                writeChannel.writeWithoutResponse(requestB64).then( (response: Characteristic) => {
                    response.monitor( (err: BleError, charactoristic: Characteristic) => {
                        if(err) {
                            console.error(err.message);
                        } else {
                            console.log("charactoristic replied");
                            let messageString = "" + Base64.decode(charactoristic.value);
                            console.log('characteristic value %s', messageString);
                            let objMsg = JSON.parse(messageString);
                            Object.keys(objMsg).forEach( (cVkey) => {
                                replyConf[cVkey] = objMsg[cVkey];
                            })
                            resolve(replyConf);
                        }
                    });
                }).catch( (err) => {
                    console.error('response %s', err.message);
                });
            } else {
                resolve(replyConf);
            }
        });
    });
};

// export const putData = (request: string): Promise<Esp32ConfT> => {
//     return new Promise( (resolve, reject) => {
//         // btdevice send request, get a response
//         bleManager.state().then( (bleState: State) => {
//             console.log('BLE State is %s', bleState);
//             if(bleState === 'PoweredOn') {
//                 console.log('Sending message to %s requesting %s', writeChannel.uuid, request);
//                 let requestB64 = Base64.encode(request);
//                 writeChannel.writeWithoutResponse(requestB64).then( (response: Characteristic) => {
//                     response.monitor( (err: BleError, charactoristic: Characteristic) => {
//                         if(err) {
//                             console.error(err.message);
//                         } else {
//                             console.log('Put got a response');
//                             resolve(Base64.decode(charactoristic.value));
//                         }
//                     });
//                 }).catch( (err) => {
//                     console.error('response %s', err.message);
//                 });
//             } else {
//                 resolve({ "message": "Bluetooth is turned off" });
//             }
//         });
//     });
// };

