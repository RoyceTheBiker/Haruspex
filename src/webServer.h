#include <map>

extern std::map<std::string, std::string>* webConfig;

void webServerSetup();
int webServerListen();
void scanNetworks();
