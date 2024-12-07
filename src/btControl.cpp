
#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include "./parameters.h"
#include <WiFi.h>

// BluetoothSerial SerialBT;
// https://www.uuidgenerator.net/
#define SERVICE_UUID        "aac12ad2-a77c-48e2-89ad-a3e7a32422fb"
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
      bool firstIter = true;
      for(std::map<std::string, std::string>::iterator wC = webConf->begin(); wC != webConf->end(); wC++) {
        if(wC->first == "ipAddress") {
          Serial.print("Set the ipAddress ");
          Serial.println(WiFi.localIP());
          wC->second = WiFi.localIP().toString().c_str();
        }
        if((wC->first != "esp32Passwd") && (wC->second.size() > 0)) {
          if(firstIter == false) reply += ",";
          reply += "\"" + wC->first + "\": \"" + wC->second + "\"";
          firstIter = false;
        }

      }

      reply += "}";
    }

    if(data.find("PUT config") == 0) {
      readJsonFile("/webConf.json", webConf);
      Serial.println("----------------------------------------------");
      Serial.println("|               Save file                    |");
      Serial.println("----------------------------------------------");
      Serial.print("Read password = '");
      Serial.print(webConf->at("esp32Passwd").c_str());
      Serial.println("'");

      // Save the data to the config file.
      std::map<std::string, std::string>* newConf = new std::map<std::string, std::string>;
      stringToMap(data.c_str() + 10, newConf);

      for(std::map<std::string, std::string>::iterator nC = newConf->begin(); nC != newConf->end(); nC++) {
        Serial.print("Copy map key value ");
        Serial.print(nC->first.c_str());
        Serial.print(" = ");
        Serial.println(nC->second.c_str());
        if((nC->first == "esp32NewPasswd") && (nC->second.size() > 0)) {
          Serial.println("Setting password");
          webConf->at("esp32Passwd") = nC->second;
          webConf->at("esp32PasswdSet") = "true";
        } else {
          webConf->at(nC->first) = nC->second;
        }
      }
      Serial.print("Saving with password = '");
      Serial.print(webConf->at("esp32Passwd").c_str());
      Serial.println("'");
      writeFile("/webConf.json", webConf);
      reply = "{ \"message\": \"Data saved\" }";
    }
    Serial.print("BT reply ");
    Serial.println(reply.c_str());
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