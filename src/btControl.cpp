
#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

// BluetoothSerial SerialBT;
// https://www.uuidgenerator.net/
#define SERVICE_UUID        "aac12ad2-a77c-48e2-89ad-a3e7a32422fe"
#define WRITE_CHARACTERISTIC_UUID "f78f9b6c-c078-4ef1-af4f-b68c1df1af4e"
#define READ_CHARACTERISTIC_UUID "915bb543-3299-403d-b924-b2c1887b4c82"

BLEServer *pServer = NULL;
BLEService *pService = NULL;
BLECharacteristic *pWriteCharacteristic = NULL;
BLECharacteristic *pReadCharacteristic = NULL;
BLEAdvertising *pAdvertising = NULL;

void btControlSetup() {
  BLEDevice::init("Haruspex ESP32");
  pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);
  pWriteCharacteristic =
    pService->createCharacteristic(WRITE_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_WRITE);

  pReadCharacteristic =
    pService->createCharacteristic(READ_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ);
  pService->start();
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined");
}

void btControlListen() {
  int dataReady = pWriteCharacteristic->getLength();
  if(dataReady > 0) {
    Serial.print("BT data ready ");
    Serial.println(dataReady, DEC);
    // std::string data = pWriteCharacteristic->getValue();
    uint8_t *data = pWriteCharacteristic->getData();

    // uint32_t int_val = (uint32_t) data.c_str();
    Serial.print("Data received length ");
    Serial.println(dataReady, DEC);


    Serial.print("Data ");
    for(int i = 0; i < dataReady; i++) {
      Serial.print(data[i], HEX);
    }
    Serial.println("");
    pWriteCharacteristic->setValue("");
    // Do something based on what the Read was
    // Reply with "Hello"
    // byte response[] = { 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00 };
    // pReadCharacteristic->setValue(response, 6);
  }
}