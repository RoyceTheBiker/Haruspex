#include "gpioPins.h"
#include "webServer.h"
#include <Arduino.h>
#include <SPIFFS.h>

int blinkDelay = 0;
unsigned char bankValue = 0;
typedef enum {
  COUNTER_MODE,
  STROBE_UP,
  STROBE_DOWN,
  LED_CONTROL
} RunMode;
int StrobeCount = 0;
int ChangeDelay = 5000;
RunMode runMode = COUNTER_MODE;
int strobeCount = 0;

void setup() {
  Serial.begin(115200);
  // Trying to stop the terminal junk from flooding the screen
  gpioPinsSetup();

  if(!SPIFFS.begin(true)){
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  } else {
    Serial.println("SPIFFS is mounted");
  }
  Serial.println("Call web setup");
  webServerSetup();
}

void loop() {
  int changeModeRequest = webServerListen();
  if(changeModeRequest == 1) {
    bankValue = 0;
    ChangeDelay = 5000;
    runMode = COUNTER_MODE;
    strobeCount = 0;
  }
  if(changeModeRequest == 2) {
    bankValue = 1;
    ChangeDelay = 1000;
    runMode = STROBE_UP;
  }
  if(changeModeRequest == 3) {
    runMode = LED_CONTROL;
    ChangeDelay = 1000;
  }

  // btControlListen();
  if(blinkDelay++ > ChangeDelay) {
    blinkDelay = 0;
    switch(runMode) {
      case COUNTER_MODE: {
        gpioSetBank(bankValue++);
        if(bankValue == 255) {
          bankValue = 0;
        }
        break;
      }
      case STROBE_UP: {
        bankValue = bankValue << 1;
        gpioSetBank(bankValue);
        if(bankValue == 128) {
          runMode = STROBE_DOWN;
        }
        break;
      }
      case STROBE_DOWN: {
        bankValue = bankValue >> 1;
        gpioSetBank(bankValue);
        if(bankValue == 1) {
          runMode = STROBE_UP;
        }
        break;
      }
      case LED_CONTROL: {
        gpioSetBank(webServerLedState());
      }
    }

    Serial.print("Pins changed ");
    Serial.print(bankValue, DEC);
    Serial.print("     \r");
  }
}



