
#include <Arduino.h>
#include <BLEDevice.h>
// #include <BLEUtils.h>
#include <BLEServer.h>
// #include <BLE2902.h>
#include "./parameters.h"

// BluetoothSerial SerialBT;
// https://www.uuidgenerator.net/
#define SERVICE_UUID        "aac12ad2-a77c-48e2-89ad-a3e7a32422fe"
#define WRITE_CHARACTERISTIC_UUID "f78f9b6c-c078-4ef1-af4f-b68c1df1af4e"

BLEServer *pServer = NULL;
BLEService *pService = NULL;
BLECharacteristic *pWriteCharacteristic = NULL;
BLEAdvertising *pAdvertising = NULL;

boolean pearConnected = false;

void startService() {
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  // pAdvertising->setMaxInterval(1500);

  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined");
}

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    Serial.println("Device connected");
    // pServer->getPeerDevices(true);
    pearConnected = true;
  };

  void onDisconnect(BLEServer* pServer) {
    pearConnected = false;
    Serial.println("Device disconnected");
    // pService->stop();

    // pService->start();
    pAdvertising->stop();
    startService();
  }
};

std::string requestMessage;

class CharacteristicCallBack : public BLECharacteristicCallbacks {
  public: void onWrite(BLECharacteristic *characteristic_) override {
    std::string data = characteristic_->getValue();

    Serial.print("Received ");
    Serial.println(data.c_str());

    std::string reply = "Unknown request";
    std::string configData = "";
    if(data == "GET config") {
      // Load the config file and send as the reply.
      readFile("credentials.json", reply);
    }

    if(data.find("SET config") == 0) {
      // Save the data to the config file.
      reply = "Data saved";
    }
    characteristic_->setValue((char *)reply.c_str());
    characteristic_->notify();
  }
};

void btControlSetup(std::string deviceHostname) {
  Serial.print("btControlSetup(");
  Serial.print(deviceHostname.c_str());
  Serial.println(")");

  BLEDevice::init(deviceHostname.c_str());
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  pService = pServer->createService(SERVICE_UUID);
  pWriteCharacteristic =
    pService->createCharacteristic(WRITE_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);

  pWriteCharacteristic->setCallbacks(new CharacteristicCallBack());

  pService->start();
  startService();
}

int checkCount = 0;
void btControlListen() {

  // If client reboots without sending a disconnect this count stays at 1
  if(checkCount++ > 500000) {
    std::map<uint16_t, conn_status_t> pDs = pServer->getPeerDevices(true);
    Serial.println("");
    Serial.print("Connected peers ");
    Serial.println(pDs.size(), DEC);
    checkCount = 0;
    for( auto const& pD: pDs) {
      Serial.print("Connected ");
      Serial.println(pD.second.connected ? "true" : "false");
      // This does not actually force the disconnect.
      // if(pearConnected == false) {
      //   Serial.println("Force disconnect");
      //   pServer->disconnect(pD.first);
      // }
    }
  }
}