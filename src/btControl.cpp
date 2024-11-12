// #include <BluetoothSerial.h>
#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

// BluetoothSerial SerialBT;

// https://www.uuidgenerator.net/
#define SERVICE_UUID        "aac12ad2-a77c-48e2-89ad-a3e7a32422fe"
#define CHARACTERISTIC_UUID "f78f9b6c-c078-4ef1-af4f-b68c1df1af4e"

BLEServer *pServer = NULL;
BLEService *pService = NULL;
BLECharacteristic *pCharacteristic = NULL;
BLEAdvertising *pAdvertising = NULL;

void btControlSetup() {
  // SerialBT.begin("ESP32test");
  BLEDevice::init("Haruspex ESP32");

  pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);
  pCharacteristic =
    pService->createCharacteristic(CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pCharacteristic->setValue("Hello from Haruspex");
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
  // if (SerialBT.available()) {
  //   Serial.write(SerialBT.read());
  // }
  // pServer->
}
