#include "gpioPins.h"
#include <Arduino.h>

int ledBar[] = {12, 14, 27, 26, 25, 33, 32, 13 };
int ledBarState[8];

void gpioPinsSetup() {
  for(int i = 0; i < 8; i++) {
    pinMode(ledBar[i], OUTPUT);
    gpioPinsSetPinState(i, 0);
  }
}

void gpioPinsSetPinState(int pinIndex, int newState) {
  // Serial.println("");
  // Serial.print("gpioPinsSetPinState: pinIndex=");
  // Serial.print(pinIndex, DEC);
  // Serial.print(" pin=");
  // Serial.print(ledBar[pinIndex], DEC);
  // Serial.print(" newState=");
  // Serial.println(newState, DEC);
  digitalWrite(ledBar[pinIndex], newState ? HIGH : LOW);
  ledBarState[pinIndex] = newState;
}

void gpioSetBank(unsigned char bankValue) {
 for(int i = 0; i < 8; i++) {
  // Serial.println("");
  // Serial.print("gpioSetBank: bankValue before=");
  // Serial.print(bankValue, DEC);
  // Serial.print(" after=");
  // Serial.println(bankValue, DEC);
  gpioPinsSetPinState(i, bankValue & 1);
  bankValue = bankValue >> 1;
 }
}