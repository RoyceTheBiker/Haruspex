#include "gpioPins.h"
#include "parameters.h"
#include <stdlib.h>
#include <SPIFFS.h>
#include <WiFi.h>

int flashSpeed = 1000;
char buffer[64];
bool wifiConfigured = true;
const char secretsFile[] = "/secrets.txt";
void scanNetworks();
WiFiServer server(80);
WiFiClient client;

void webServerSetup() {
  // initialize LED digital pin as an output.

  char wifiSsid[64];
  char wifiPass[64];
  char wifiHost[64];

  wifiConfigured &= readValue(secretsFile, "WiFi SSID", wifiSsid) ? true : false;
  wifiConfigured &= readValue(secretsFile, "WiFi PASS", wifiPass) ? true : false;
  wifiConfigured &= readValue(secretsFile, "Hostname", wifiHost) ? true : false;
  // scanNetworks();
  if(wifiConfigured) {
    WiFi.setHostname(wifiHost);
    WiFi.mode(WIFI_AP_STA);
    WiFi.begin(wifiSsid, wifiPass);
    Serial.print("Connecting to WiFi ..");
    while (WiFi.status() != WL_CONNECTED) {
      Serial.print('.');
      delay(1000);
    }
    Serial.println(WiFi.localIP());
    Serial.print("RRSI: ");
    Serial.println(WiFi.RSSI());

    server.begin();
  }
}

int webServerListen() {
  int changeMode = 0;
  if(wifiConfigured) {
    String header;
    client = server.available(); // Listen for incoming clients
    if (client) { // If a new client connects,
      Serial.println("New Client."); // print a message out in the serial port
      String currentLine = ""; // make a String to hold incoming data from the client
      while (client.connected()) { // loop while the client's connected
        if (client.available()) { // if there's bytes to read from the client,
          char c = client.read(); // read a byte, then
          Serial.write(c); // print it out the serial monitor
          header += c;
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
              if (header.indexOf("GET /api/") >= 0) {
                if(header.indexOf("bounce") > 0) {
                  changeMode = 2;
                }
                if(header.indexOf("count") > 0) {
                  changeMode = 1;
                }
                Serial.println(header);
              } else {
                File file = SPIFFS.open("/index.html");
                if(!file){
                  Serial.println("Failed to open header.html file for reading");
                } else {
                  char lineBuffer[128];
                  while(file.available()) {
                    int readBytes = file.readBytesUntil('\n', lineBuffer, 128);
                    lineBuffer[readBytes] = 0;
                    client.println(lineBuffer);
                  }
                  file.close();
                }
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
      header = "";
      // Close the connection
      client.stop();
      Serial.println("Client disconnected.");
      Serial.println("");
    }
  }
  return(changeMode);
}

void scanNetworks() {
  if(wifiConfigured) {
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
        delay(10);
      }
    }
  }
}
