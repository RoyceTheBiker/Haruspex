import { styles } from '../styles/globalStyles';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function WifiSetup({navitation, route}) {
    
    return (
        <View style={styles.container}>
        <Text style={styles.titleBar}>Haruspex {route.params.name}</Text>
        {/* <!-- StatusBar style="auto" / --> */}
    
        <View style={styles.fieldSet}>
            <Text style={styles.legend}>Hostname</Text>
            <TextInput
            style={styles.input}
            // onChangeText={onChangeText}
            placeholder="hostname"          
            />
        </View>
    
        <View style={styles.fieldSet}>
            <Text style={styles.legend}>Wi-Fi SSID</Text>
            <TextInput
            style={styles.input}
            // onChangeText={onChangeText}
            placeholder="ssid"          
            />
        </View>
    
        <View style={styles.fieldSet}>
            <Text style={styles.legend}>Wi-Fi Password</Text>
            <TextInput
            style={styles.input}
            // onChangeText={onChangeText}
            placeholder="password"          
            />
        </View>
    
        <TouchableOpacity style={styles.button}>
            <Text onPress={() => Alert.alert('Saved')}>
            Save Settings
            </Text>
        </TouchableOpacity>
    </View>
    );
}
    