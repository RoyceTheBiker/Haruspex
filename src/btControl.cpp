
#include <Arduino.h>
// #include <Base64.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>

// BluetoothSerial SerialBT;
// https://www.uuidgenerator.net/
#define SERVICE_UUID        "aac12ad2-a77c-48e2-89ad-a3e7a32422fe"
#define WRITE_CHARACTERISTIC_UUID "f78f9b6c-c078-4ef1-af4f-b68c1df1af4e"
#define READ_CHARACTERISTIC_UUID "915bb543-3299-403d-b924-b2c1887b4c82"

BLEServer *pServer = NULL;
BLEService *pService = NULL;
BLECharacteristic *pWriteCharacteristic = NULL;
// BLECharacteristic *pReadCharacteristic = NULL;
BLEAdvertising *pAdvertising = NULL;
BLEDescriptor *descriptor;

boolean pearConnected = false;

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

    pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06);
    pAdvertising->setMinPreferred(0x12);
    // pAdvertising->setMaxInterval(1500);

    BLEDevice::startAdvertising();
    Serial.println("Characteristic defined");
  }
};

std::string requestMessage;

class CharacteristicCallBack : public BLECharacteristicCallbacks {
  public: void onWrite(BLECharacteristic *characteristic_) override {
    Serial.println("Do you smell that? It's data received.");
    // onWrite(characteristic_);
    int dataReady = characteristic_->getLength();
    if(dataReady > 0) {
      Serial.print("BT data ready ");
      Serial.println(dataReady, DEC);
      std::string data = characteristic_->getValue();

      // Serial.print("Data received length ");
      // Serial.println(dataReady, DEC);

      Serial.print("Data ");
      Serial.println(data.c_str());
      // Serial.print("Incoming characteristic UUID ");
      // Serial.println(characteristic_->getUUID().toString().c_str());
      std::string reply = "Okay thanks. I would like that.";
      // requestMessage = data;

      // pWriteCharacteristic->setValue("I like hugs");
      // pReadCharacteristic->setValue("get a job");
      characteristic_->setValue((char *)reply.c_str());
      characteristic_->notify();
    }
  }
};

class DescrCallBack : public BLEDescriptorCallbacks {
  public: void onWrite(BLEDescriptor *desc) override {
    Serial.println("Data received in DescrCallBack!");
    // onWrite(desc);
  }
};

// void onWrite(Bluetoo)
void btControlSetup() {
  BLEDevice::init("Haruspex ESP32");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  pService = pServer->createService(SERVICE_UUID);
  pWriteCharacteristic =
    pService->createCharacteristic(WRITE_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);

  // pReadCharacteristic =
  //   pService->createCharacteristic(READ_CHARACTERISTIC_UUID,
  //   BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);

  // Set the callBack handler for the onWrite event
  // descriptor = new BLE2902();
  // descriptor->setCallbacks(new DescrCallBack());
  // pWriteCharacteristic->addDescriptor(descriptor);
  pWriteCharacteristic->setCallbacks(new CharacteristicCallBack());

  pService->start();
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  // pAdvertising->setMaxInterval(1500);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined");
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
      if(pearConnected == false) {
        Serial.println("Force disconnect");
        pServer->disconnect(pD.first);
      }
    }
  }
}