#include <Arduino.h>
#include "parameters.h"
#include <SPIFFS.h>

std::string fileBuffer;

/**
 * readValue
 * Reads a single value from flat config file
 *
 * const char* fileName, name of file to read
 * char* paramName, key name to get value of
 * std::string fileBuffer, buffer to store value in
 *
 * returns number of bytes in the return value
 */
int readValue(const char* fileName, char* paramName, std::string fileBuffer) {
  int returnLength = 0;
  // fileBuffer[0] = 0;
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
      parseLine.getBytes((unsigned char*)fileBuffer.c_str(), 64, paramString.length());
      returnLength = fileBuffer.length();
    }
  }
  file.close();
  return(returnLength);
}

/**
 * readJsonFile
 * Reads the content of a JSON file on the partition.
 * This only supports simple arrays and cannot have objects as values.
 *
 * const char* fileName, name of file to read
 * std::map<std::string, std::string> keysValues, the content of a simple JSON array in [key, value] strings.
 *
 * return number of [key, value] pairs read from JSON file
 */
int readJsonFile(const char* fileName, std::map<std::string, std::string>* keysValues) {
  enum parseStateT {
    OUTSIDE_JSON,
    INSIDE_ARRAY,
    INSIDE_KEY,
    KEY_SET,
    INSIDE_VALUE,
    VALUE_SET
  };

  Serial.print("readJsonFile(");
  Serial.print(fileName);
  Serial.println(")");
  parseStateT parseState = OUTSIDE_JSON;
  int keyValueCount = 0;
  std::string fileBuffer;
  std::string nextKey = "";
  std::string nextValue = "";
  Serial.println("Call readFile");
  delay(2000);
  std::string jsonFile = readFile(fileName);

  Serial.println("Came back with a file that is ");
  Serial.print(jsonFile.length(), DEC);
  Serial.println(" bytes long");
  delay(2000);

  if(jsonFile.length() > 0) {
    while(jsonFile.length() > 0) {
      char nextByte = jsonFile.c_str()[0];
      jsonFile.erase(0, 1);
      switch(parseState) {
        case OUTSIDE_JSON: {
          if(nextByte == '{') parseState = INSIDE_ARRAY;
          break;
        }
        case INSIDE_ARRAY: {
          if(nextByte == '"') parseState = INSIDE_KEY;
          break;
        }
        case INSIDE_KEY: {
          if(nextByte == '"') {
            parseState = KEY_SET;
          } else {
            nextKey += nextByte;
          }
          break;
        }
        case KEY_SET: {
          if(nextByte == '"') parseState = INSIDE_VALUE;
          break;
        }
        case INSIDE_VALUE: {
          // Escape can add quote to value
          if(nextByte == '\\') {
            nextByte = fileBuffer.c_str()[0];
            fileBuffer.erase(0, 1);
          } else {
            if(nextByte == '"') {
              parseState = VALUE_SET;
              Serial.print("JSON key, value = ");
              Serial.print(nextKey.c_str());
              Serial.print(", ");
              Serial.println(nextValue.c_str());
              keysValues->insert( {nextKey.c_str(), nextValue.c_str() });
              nextKey = "";
              nextValue = "";
            } else {
              nextValue += nextByte;
            }
          }
          break;
        }
        case VALUE_SET: {
          parseState = INSIDE_ARRAY;
          break;
        }

        // Anything else and we don't care
        default: break;
      }
    }
  }
  return keyValueCount;
}

/**
 * readFile
 * Reads the entire content of the file on the partition.
 *
 * const char* fileName, name of file to read
 * std::string fileBuffer, string to contain the file content
 *
 * return number of bytes read from file
 */
std::string readFile(const char* fileName) {
  File file = SPIFFS.open(fileName);
  if(!file){
    Serial.println("Failed to open file for reading");
    return(0);
  }

  if(file.available()) {
    Serial.println("About to read bytes into string");
    char lineBuffer[128];
    while(file.available()) {
      int readBytes = file.readBytesUntil('\n', lineBuffer, 128);
      Serial.print("Bytes read ");
      Serial.println(readBytes, DEC);
      lineBuffer[readBytes] = 0;
      fileBuffer += lineBuffer;
    }
    Serial.println("Are we good now?");
    Serial.print("Buffer length ");
    Serial.println(fileBuffer.length(), DEC);
    Serial.println(fileBuffer.c_str());
  }
  file.close();
  return(fileBuffer);
}


// int writeValue(const char* fileName, char* paramName, char *paramValue) {
//   return(0);
// }
