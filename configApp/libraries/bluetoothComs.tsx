import { BleManager, Device, State } from "react-native-ble-plx";
import { Esp32ConfT } from "../models/esp32Conf";

let bleManager: BleManager;
let btDevice: Device;

export function initBluetooth(connectDevice: string) {
    if(!bleManager) {
        bleManager = new BleManager();
        if(bleManager) {
            bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                console.log('Device scan error %s', error.message);
                } else {
                if((connectDevice === device.localName) || (connectDevice === device.name)) {
                    btDevice = device;
                }
                }
            });
        }
    }  
}

export const getData = (request: string): Promise<string> => {
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
                console.log('Sending message');

            }
            resolve(returnMessage);
        });        
    });
};

export const putData = (request: object): Promise<string> => {
    return new Promise( (resolve, reject) => {
        // btdevice send request, get a responce
    });
};

