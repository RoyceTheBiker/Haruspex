#include <map>

extern std::string fileBuffer;

int readValue(const char* fileName, char* paramName, std::string valueBuffer);
std::string readFile(const char* fileName);
int readJsonFile(const char* fileName, std::map<std::string, std::string>* keysValues);
int stringToMap(std::string jsonString, std::map<std::string, std::string>* keysValues);
void writeFile(const char* fileName, std::map<std::string, std::string>* jsonData);
// int writeValue(const char* fileName, char* paramName, std::string paramValue);
