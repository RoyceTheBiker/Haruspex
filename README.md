# Haruspex 
A web server built on the ESP32 platform.

First commit was a rudimentary web server as taken from the example [ESP32 Web Server](https://randomnerdtutorials.com/esp32-web-server-arduino-ide/)
with some small changes.

Code was changed to not block requests from other clients so that multiple connections can be made.

<!-- vscode-markdown-toc -->
* 1. [Development](#Development)
	* 1.1. [VS Codium](#VSCodium)
	* 1.2. [Hardware](#Hardware)
* 2. [configApp](#configApp)
* 3. [Compiling The APK](#CompilingTheAPK)
* 4. [Wifi Credentials](#WifiCredentials)
* 5. [The Data Partition](#TheDataPartition)
* 6. [Useful Links](#UsefulLinks)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name='Development'></a>Development
###  1.1. <a name='VSCodium'></a>VS Codium
The development of this project is done with VSCodium and the PlatformIO extension.

VSCodium is not supported by Microsoft and so these plugins must be manually installed.
1. Download [cpptools-linux.vsix](https://github.com/microsoft/vscode-cpptools/releases/download/1.3.1/cpptools-linux.vsix)
2. Install cpptools-linux.vsix in vscodium under extensions / install from vsix
3. Download [PlatformIO vsix](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide) (download button on right side)
4. Install PlatformIO vsix in vscodium under extensions / install from vsix

###  1.2. <a name='Hardware'></a>Hardware
[Fritzing](https://fritzing.org/) was used to create the board layout.

EPS32 part for Fritzing can be found here [ESP32S-HiLetgo Dev Boad with Pinout Template](https://forum.fritzing.org/t/esp32s-hiletgo-dev-boad-with-pinout-template/5357?u=steelgoose)

![ESP32_4.gif](https://silicontao.com/api/files/getFile/marquis/a4b531f19abc24e166fa17bd657dd1408142f0c3)

```bash
# esptool flash_id
esptool.py v2.8
Found 1 serial ports
Serial port /dev/ttyUSB0
Connecting....
Detecting chip type... ESP32
Chip is ESP32D0WDQ5 (revision 3)
Features: WiFi, BT, Dual Core, 240MHz, VRef calibration in efuse, Coding Scheme None
Crystal is 40MHz
MAC: 08:d1:f9:e6:b1:68
Enabling default SPI flash mode...
Manufacturer: 5e
Device: 4016
Detected flash size: 4MB
Hard resetting via RTS pin...
```

##  2. <a name='configApp'></a>configApp
An Android app developed using Ract-Native Expo

First attepmt to use Bluetooth was with [react-native-ble-manager](https://www.npmjs.com/package/react-native-ble-manager) which seems like a great choice with support for Android 4 and newer APIs. 
Unfortunatly it does not seem to be compatible with Expo because it requires setting [AndroidManifest](https://github.com/innoveit/react-native-ble-manager/blob/master/example/plugins/withBLEAndroidManifest.js) that is not supported by Expo, or at least not in this way.

Expo has a different module [react-native-ble-plx](https://expo.dev/blog/how-to-build-a-bluetooth-low-energy-powered-expo-app)

[Expo Go](https://expo.dev/go) does not support using the Bluetooth hardware but is great for quickly testing screen layout and desgines, it will automatically update with changes live.

Installing packages uses ``npx expo install <package name>``.

Uninstalling packages uses ``npm uninstall <package name>``.


```bash
npm uninstall react-native-ble-manager
npx expo install react-native-ble-plx
```

Installing VSCode plugins:
 - Expo Tools

Installing Android Studio
```bash
brew install --cask android-platform-tools
rehash
adb device
```

```bash
#npx npm install eas-cli
npm install --global eas-cli
npx expo prebuild
npx expo install expo-dev-client
npx expo run:android
```

To build the APK use [eas-cli](https://www.npmjs.com/package/eas-cli)

Set the Android SDK path and environment variable in the shell profile
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/emulator
```

npx expo install react-native-gesture-handler react-native-safe-area-context react-native-reanimated react-native-screens

## Android Debug Bridge (adb)
List files in Screenshots folder
```
adb shell ls -R "/storage/self/primary/DCIM//Screenshots/"
```

Download a screenshot
```
adb pull /storage/self/primary/DCIM//Screenshots/Screenshot_20241112-092414_Haruspex.jpg ~/Screenshot_20241112-092414_Haruspex.jpg
/storage/self/primary/DCIM//Screenshots/Screenshot_20241112-092414_Ha...pex.jpg: 1 file pulled, 0 skipped. 13.0 MB/s (191856 bytes in 0.014s)
```


##  3. <a name='CompilingTheAPK'></a>Compiling The APK
This step requiers the user to have a login account with [Expo](https://expo.dev)

The compiler does not generate log files on the build system. Compile log files are found in the web console for the project on [expo.dev](https://expo.dev/)

```bash
eas build -p android --profile development
```

Add ``--local`` to compile locally and not use a build slot on [expo.dev](https://expo.dev)
```bash
eas build -p android --profile development --local
```


##  4. <a name='WifiCredentials'></a>Wifi Credentials
These need to be set in ``./data/secrets.txt``.

An example can be found in ``./data/secrets.txt.example``
```txt
Hostname = esp32host
WiFi SSID = TheWifiLove
WiFi PASS = Slartibartfast
```

Copy ``./data/secrets.txt.example`` to ``./data/secrets.txt`` and change the values for the local network. This file will not be uploaded to Git.

# Partitions
Adding Bluetooth libraries made the binary 1.5MB and was to large for the default 1.3MB app partition.

A custom partition was made to remove OTA partitions and increase the app partition size.

> **_NOTE:_** [Offset must be multiple of 4kB (0x1000) and for app partitions it must be aligned by 64kB (0x10000).](https://developer.espressif.com/blog/how-to-use-custom-partition-tables-on-esp32/)

##  5. <a name='TheDataPartition'></a>The Data Partition
The data partition is used to store files that are not compiled code.

The ``./data`` directory must be built as a Filesystem Image in PlatformIO and uploaded to the ESP32.

The LibreOffice Calc file is configured to calculate the partition sizes and offsets. It uses a function to convert HEX2DEC, perform the calculations and convert back to HEX with a prefix ``0x``

```
=CONCAT("0x", DEC2HEX(HEX2DEC(RIGHT(D3, LEN(D3)-2))+HEX2DEC(RIGHT(E3, LEN(E3)-2))))
```

# Frontend CDN
The frontend files are served from a CDN (Content Delivery Network).
To do this ``Access-Control-Allow-Origin`` is set in the header served by [webServer.cpp](./src/webServer.cpp)
and in the [CDN](https://haruspex.SiliconTao.com/).
For development the frontend can be served locally using [webServer.py](./frontend/webServer.py) that has CORS enabled.

##  6. <a name='UsefulLinks'></a>Useful Links
- [ESP32 Dev Kit Power Options](https://techexplorations.com/guides/esp32/begin/power/)
- [Amazon ESP32 Dev](https://www.amazon.ca/gp/product/B07QCP2451/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&th=1)
- [ESP32-WROOM Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf)
- [FCC Report for 2A4RQ-ESP32](https://fcc.report/FCC-ID/2A4RQ-ESP32)
- [ESP32 Partition Tables](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/partition-tables.html)
- [ESP32 Partition Calculator](https://esp32.jgarrettcorbin.com/)
- [react-native-ble-plx-demo](https://github.com/priyanka-Sadh/react-native-ble-plx-demo)
- [Example of Expo with react-native-ble-pl](https://blog.theodo.com/2023/07/ble-integration-for-rn-apps/)