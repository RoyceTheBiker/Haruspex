#include <SPIFFS.h>

int readValue(char* fileName, char* paramName, char valueBuffer[]) {
  int returnLength = 0;
  valueBuffer[0] = 0;
  File file = SPIFFS.open(fileName);
  if(!file){
    Serial.println("Failed to open file for reading");
    return(0);
  }

  String paramString(paramName);
  paramString += " = ";
  Serial.print("Read setting: ");
  Serial.println(paramName);
  char lineBuffer[128];
  while(file.available()) {
    int readBytes = file.readBytesUntil('\n', lineBuffer, 128);
    lineBuffer[readBytes] = 0;
    String parseLine(lineBuffer);
    if(parseLine.indexOf(paramString) == 0) {
      parseLine.getBytes((unsigned char*)valueBuffer, 64, paramString.length());
      returnLength = parseLine.length() - paramString.length();
    }
  }
  file.close();
  return(returnLength);
}

int writeValue(char* fileName, char* paramName, char *paramValue) {
  return(0);
}
