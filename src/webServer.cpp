#include <Arduino.h>
#include "btControl.h"
#include "gpioPins.h"
#include "parameters.h"
#include <map>
#include <stdlib.h>
#include <SPIFFS.h>
#include <WiFi.h>

uint8_t ledState = 0;
int flashSpeed = 1000;
char buffer[64];
const char secretsFile[] = "/secrets.txt";
WiFiServer server(80);
WiFiClient client;
std::map<std::string, std::string>* webConfig;

void webServerSetup() {
  webConfig = new std::map<std::string, std::string>;

  Serial.println("Call readJsonFile");
  readJsonFile("/webConf.json", webConfig);
  Serial.print("esp32SSID ");
  Serial.println(webConfig->at("esp32SSID").c_str());
  Serial.print("esp32Passwd ");
  Serial.println(webConfig->at("esp32Passwd").c_str());
  if((webConfig->at("esp32SSID").length() > 0) && (webConfig->at("esp32Passwd").length() > 0)) {
    webConfig->at("esp32PasswdSet") = "true";
    WiFi.setHostname(webConfig->at("esp32Hostname").c_str());
    WiFi.mode(WIFI_AP_STA);
    WiFi.begin(webConfig->at("esp32SSID").c_str(), webConfig->at("esp32Passwd").c_str());
    Serial.print("Connecting to WiFi ..");
    while (WiFi.status() != WL_CONNECTED) {
      Serial.print('.');
    }
    Serial.println(WiFi.localIP());
    Serial.print("RRSI: ");
    Serial.println(WiFi.RSSI());

    webConfig->at("ipAddress") = WiFi.localIP();
    server.begin();
  }
  // We use the password to connect to Wi-Fi but must never send it over Bluetooth.
  // esp32PasswdSet is true if the password is set
  // ipAddress is not blank if SSID and password can connect to Wi-Fi
  webConfig->at("esp32Passwd") = "";
  btControlSetup(webConfig);
}

uint8_t webServerLedState() {
  return(ledState);
}

int webServerListen() {
  int changeMode = 0;
  String request;
  client = server.available(); // Listen for incoming clients
  if (client) { // If a new client connects,
    Serial.println("New Client."); // print a message out in the serial port
    String currentLine = ""; // make a String to hold incoming data from the client
    while (client.connected()) { // loop while the client's connected
      if (client.available()) { // if there's bytes to read from the client,
        char c = client.read(); // read a byte, then
        Serial.write(c); // print it out the serial monitor
        request += c;
        if (c == '\n') { // if the byte is a newline character
        // if the current line is blank, you got two newline characters in a row.
        // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
          // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
          // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Access-Control-Allow-Origin: *");
            client.println("Connection: close");
            client.println();

            // turns the GPIOs on and off
            if (request.indexOf("GET /api/") >= 0) {
              if(request.indexOf("bounce") > 0) {
                changeMode = 2;
              }
              if(request.indexOf("count") > 0) {
                changeMode = 1;
              }
              if(request.indexOf("ledsalloff") > 0) {
                changeMode = 3;
                ledState = 0;
              }
              if(request.indexOf("led/on/") > 0) {
                request.remove(0, 16);
                uint8_t bitMask = 1;
                for (int shiftIt = 0; shiftIt < atoi(request.c_str()); shiftIt++) {
                  bitMask <<= 1;
                }
                // Bitwise OR to turn on the bit
                ledState = ledState | bitMask;
              }
              if(request.indexOf("led/off/") > 0) {
                request.remove(0, 17);
                uint8_t bitMask = 254;
                for (int shiftIt = 0; shiftIt < atoi(request.c_str()); shiftIt++) {
                  bitMask <<= 1;
                  bitMask += 1;
                }
                // Bitwise AND to turn on the bit
                ledState = ledState & bitMask;
              }
              Serial.println(request);
            } else {
              String fileString = readFile("/index.html").c_str();
              fileString.replace("CDNHOST", webConfig->at("esp32Cdn").c_str());
              fileString.replace("WEBTYPE", webConfig->at("webType").c_str());
              client.println(fileString.c_str());
            }

            client.println();
            break;
          } else { // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      } else {
        break;
      }
    }
    // Clear the header variable
    request = "";
    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
  return(changeMode);
}

void scanNetworks() {
  // WiFi.scanNetworks will return the number of networks found
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0) {
      Serial.println("no networks found");
  } else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN)?" ":"*");
    }
  }
}
