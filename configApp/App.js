import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [text, onChangeText] = React.useState('Useless Text');

  return (
    <View style={styles.container}>
      <Text style={styles.titleBar}>Haruspex configuration app</Text>
      <StatusBar style="auto" />

      <View style={styles.fieldSet}>
        <Text style={styles.legend}>Hostname</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="hostname"          
        />
      </View>

      <View style={styles.fieldSet}>
        <Text style={styles.legend}>Wi-Fi SSID</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="ssid"          
        />
      </View>

      <View style={styles.fieldSet}>
        <Text style={styles.legend}>Wi-Fi Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="password"          
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text onPress={() => Alert.alert('Left button pressed')}>
          Save Settings
        </Text>
      </TouchableOpacity>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffeee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'lightgreen',
    height: 50,    
    width: 130,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBar: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fieldSet:{
      margin: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      alignItems: 'center',
      borderColor: '#000',
      width: '80%',
      height: 50,
      backgroundColor: '#fff',
  },
  legend:{
      position: 'absolute',
      top: -10,
      left: 10,
      fontWeight: 'bold',
      backgroundColor: '#FFFFFF'
  },
  input: {
    height: 40,
    margin: 12,
    width: '100%',
    padding: 10,
  },
});