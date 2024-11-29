import { BleError, BleManager, Characteristic, Device, LogLevel, Service, State } from "react-native-ble-plx";
import { Esp32ConfT } from "../models/esp32Conf";
import Base64 from 'react-native-base64';

let bleManager: BleManager;
let btDevice: Device;
let btServices: Array<Service>;
let readChannel: Characteristic;
let writeChannel: Characteristic;

const ServiceUUID   = "aac12ad2-a77c-48e2-89ad-a3e7a32422fe"
const ReadFromESP32 = "915bb543-3299-403d-b924-b2c1887b4c82"
const WriteToESP32  = "f78f9b6c-c078-4ef1-af4f-b68c1df1af4e"

export const initBluetooth = (connectDevice: string): Promise<string> => {
    return new Promise( (resolve) => {
        if(!bleManager) {
            bleManager = new BleManager();
            if(bleManager) {
                bleManager.setLogLevel(LogLevel.Verbose);
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

export const connectToDevice = (deviceName: string): Promise<string> => {
    console.log('Connecting to BT device %s', deviceName);
    return new Promise( (resolve) => {
        console.log('Call connect');
        btDevice.connect({requestMTU: 517}).then( (device: Device) => {
            console.log('Discovering characteristics');
            return device.discoverAllServicesAndCharacteristics();
        }).then( (device: Device) => {
            console.log('charactoristics discovered');
            return device.services();
        }).then( (services: Service[]) => {
            
            btServices = new Array<Service>;
            services.forEach( (service) => {
                btServices.push(service);
                service.characteristics().then( (channels: Characteristic[]) => {
                    channels.forEach( (channel) => {
                        if(channel.uuid === ReadFromESP32) {
                            readChannel = channel;
                            // console.log('setupMonitoring');
                            // setupMonitoring(btDevice);
                            console.log('read channel has write with response %s', channel.isWritableWithResponse ? 'true' : 'false');
                        }
                        if(channel.uuid === WriteToESP32) {
                            console.log('write channel has write with response %s', channel.isWritableWithResponse ? 'true' : 'false');

                            writeChannel = channel;
                        }
                    });
                });
            });
            resolve('Connected');
        });
    });
}

// const incomingMessage = (error: BleError | null, charactoristic: Characteristic | null) => {
//     if(error) {
//         console.error(error.message);
//         return;
//     }
//     if(!charactoristic?.value) {
//         console.error('No data');
//         return;
//     }
//     console.log('Data %s', Base64.decode(charactoristic.value));
// }

// const setupMonitoring = async (device: Device) => {
//     if(device) {
//         console.log('setupMonitoring');
//         device.monitorCharacteristicForService(ServiceUUID, ReadFromESP32, incomingMessage);
//     }
// }

export const getData = (request: string): Promise<string> => {
    console.log('Request: %s', request);
    return new Promise( (resolve) => {
        let replyConf = {
            esp32Cdn: 'butterScotchLane',
            esp32Hostname: 'Little Orphan Candy',
            esp32PasswdSet: true,
            esp32SSID: 'Freeman' } as Esp32ConfT;

        let returnMessage = JSON.stringify(replyConf);

        bleManager.state().then( (bleState: State) => {
            console.log('BLE State is %s', bleState);
            if(bleState === 'PoweredOn') {
                console.log('Sending message to %s', writeChannel.uuid);
                console.log('request %s', request);
        
                let requestB64 = Base64.encode(request);
                // console.log('requestB64 length %d', requestB64.length);
                // console.log('requestB64 %s', requestB64);
                
                // This does not get the response message
                // writeChannel.writeWithResponse(requestB64).then( (response: Characteristic) => {                    
                //     response.monitor( (err: BleError, charactoristic: Characteristic) => {
                //         if(err) {
                //             console.error(err.message);
                //         } else {
                //             console.log('characteristic value %s', Base64.decode(charactoristic.value));
                //             resolve(Base64.decode(charactoristic.value));
                //         }
                //     });
                // }).catch( (err) => {
                //     console.error('response %s', err.message);
                // });

                writeChannel.writeWithoutResponse(requestB64).then( (response: Characteristic) => {
                    response.monitor( (err: BleError, charactoristic: Characteristic) => {
                        if(err) {
                            console.error(err.message);
                        } else {
                            // console.log("charactoristic %s", JSON.stringify(charactoristic));
                            console.log('characteristic value %s', Base64.decode(charactoristic.value));
                            resolve(Base64.decode(charactoristic.value));
                        }
                    });
                }).catch( (err) => {
                    console.error('response %s', err.message);
                });

                // This does not get the response message
                // btDevice.writeCharacteristicWithResponseForService(ServiceUUID, WriteToESP32, requestB64).then( (response: Characteristic) => {
                //     // console.log('got a response from %s', response.uuid);
                //     // console.log('got a response %s', Base64.decode(response.value));
                //     response.monitor( (err: BleError, charactoristic: Characteristic) => {
                //         if(err) {
                //             console.error(err.message);
                //         } else {
                //             console.log('characteristic value %s', Base64.decode(charactoristic.value));
                //         }
                //     });
                // }).catch( (err) => {
                //     console.error(err.message);
                // });

                // This gets a response that will get the response message as the next block of text after the send message.
                // bleManager.writeCharacteristicWithoutResponseForDevice(btDevice.id, ServiceUUID, WriteToESP32, requestB64)
                //         .then( (response: Characteristic) => {
                //     // console.log('got a response from %s', response.uuid);
                //     // console.log('got a response %s', Base64.decode(response.value));
                //     response.monitor( (err: BleError, charactoristic: Characteristic) => {
                //         if(err) {
                //             console.error(err.message);
                //         } else {
                //             console.log('characteristic value %s', Base64.decode(charactoristic.value));
                //         }
                //     });                    
                // }).catch( (err) => {
                //     console.error(err.message);
                // });
            } else {
                resolve('Device is powered off');
            }
        });
    });
};

export const putData = (request: object): Promise<string> => {
    return new Promise( (resolve, reject) => {
        // btdevice send request, get a responce
    });
};

