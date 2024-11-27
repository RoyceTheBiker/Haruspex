#include <map>

int readValue(const char* fileName, char* paramName, std::string valueBuffer);
int readFile(const char* fileName, std::string valueBuffer);
int readJsonFile(const char* fileName, std::map<std::string, std::string>* keysValues);

// int writeValue(const char* fileName, char* paramName, std::string paramValue);
