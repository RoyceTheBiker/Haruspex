import { BleManager, Characteristic, Device, Service, State } from "react-native-ble-plx";
import { Esp32ConfT } from "../models/esp32Conf";
import { btoa, atob } from "react-native-quick-base64";

let bleManager: BleManager;
let btDevice: Device;
let btServices: Array<Service>;
let readChannel: Characteristic;
let writeChannel: Characteristic;

const ReadFromESP32 = "915bb543-3299-403d-b924-b2c1887b4c82"
const WriteToESP32 = "f78f9b6c-c078-4ef1-af4f-b68c1df1af4e"

export const initBluetooth = (connectDevice: string): Promise<string> => {
    return new Promise( (resolve) => {
        if(!bleManager) {
            bleManager = new BleManager();
            if(bleManager) {
                bleManager.startDeviceScan(null, null, (error, device) => {
                    if (error) {
                        console.log('Device scan error %s', error.message);
                    } else {
                        if((connectDevice === device.localName) || (connectDevice === device.name)) {
                            console.log('BT Device is set');
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
        btDevice.connect().then( (device: Device) => {
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
                        }
                        if(channel.uuid === WriteToESP32) {
                             writeChannel = channel;
                        }
                    });
                });
            });
            resolve('Connected');
        });
    });
}

export const getData = (request: string): Promise<string> => {
    console.log('GET %s', request);

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
                console.log('request length %d', request.length);                            
                while(request.length % 4 !== 0) {
                    request = request + ' ';
                }
                let requestBytes = atob(request);
                console.log('requestBytes length %d', requestBytes.length);                            

                writeChannel.writeWithResponse(requestBytes).then( (responce: Characteristic) => {
                    resolve(responce.value);
                });
            }
        });        
    });
};

export const putData = (request: object): Promise<string> => {
    return new Promise( (resolve, reject) => {
        // btdevice send request, get a responce
    });
};

