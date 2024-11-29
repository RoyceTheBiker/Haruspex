
#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
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
std::string requestMessage;

std::map<std::string, std::string>* webConf;

void startService() {
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);

  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined");
}

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    Serial.println("Device connected");
    pearConnected = true;
  };

  void onDisconnect(BLEServer* pServer) {
    pearConnected = false;
    Serial.println("Device disconnected");
    pAdvertising->stop();
    startService();
  }
};

class CharacteristicCallBack : public BLECharacteristicCallbacks {
  public: void onWrite(BLECharacteristic *characteristic_) override {
    std::string data = characteristic_->getValue();

    Serial.print("Received ");
    Serial.println(data.c_str());

    std::string reply = "Unknown request";
    std::string configData = "";
    if(data == "GET config") {
      // Load the config file and send as the reply.
      reply = "{";
      for(std::map<std::string, std::string>::iterator wC = webConf->begin(); wC != webConf->end(); wC++) {
        if(wC->first != "esp32Passwd" ) {
          reply += "\"" + wC->first + "\": \"" + wC->second + "\",";
        }
      }
      reply += "}";
    }

    if(data.find("SET config") == 0) {
      // Save the data to the config file.
      reply = "Data saved";
    }
    characteristic_->setValue((char *)reply.c_str());
    characteristic_->notify();
  }
};

void btControlSetup(std::map<std::string, std::string>* givenWebConfig) {
  webConf = givenWebConfig;
  Serial.print("btControlSetup(");
  Serial.print(webConf->at("esp32Hostname").c_str());
  Serial.println(")");

  BLEDevice::init(webConf->at("esp32Hostname").c_str());
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

void btControlListen() {
}