# Haruspex

A web server built on the ESP32 platform.

The development of this project is done with VSCodium and the PlatformIO extension.

VSCodium is not supported by Microsoft and so these plugins must be manually installed.
1. Download [cpptools-linux.vsix](https://github.com/microsoft/vscode-cpptools/releases/download/1.3.1/cpptools-linux.vsix)
2. Install cpptools-linux.vsix in vscodium under extensions / install from vsix
3. Download [PlatformIO vsix](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide) (download button on right side)
4. Install PlatformIO vsix in vscodium under extensions / install from vsix

First commit was a rudimentary web server as taken from the example [ESP32 Web Server](https://randomnerdtutorials.com/esp32-web-server-arduino-ide/)
with some small changes.

Using pin 33 and not blocking requests from other clients.

## The Data Partition
The data partition is used to store files that are not compiled code.

The ``./data`` directory must be built as a Filesystem Image in PlatformIO and uploaded to the ESP32.

## Wifi Credentials
These need to be set in ``./data/secrets.txt``.

An example can be found in ``./data/secrets.txt.example``
```txt
Hostname = esp32host
WiFi SSID = TheWifiLove
WiFi PASS = Slartibartfast
```
