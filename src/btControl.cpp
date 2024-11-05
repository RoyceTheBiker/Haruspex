#include <BluetoothSerial.h>

BluetoothSerial SerialBT;

void btControlSetup() {
  SerialBT.begin("ESP32test");
}

void btControlListen() {
  if (SerialBT.available()) {
    Serial.write(SerialBT.read());
  }
}
