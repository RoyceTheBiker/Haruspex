extern int ledBar[];
extern int ledBarState[];

void gpioPinsSetup();
void gpioPinsSetPinState(int pinIndex, int newState);
void gpioSetBank(unsigned char bankValue);