import { styles } from '../styles/globalStyles';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const data = [
    {
      id: 0,
      name: 'Apple',
      cost: '$1'
    }, 
    {
      id: 1,
      name: 'Bacon',
      cost: '$10'
    },
    {
      id: 2,
      name: 'Cantaloupe',
      cost: '$7.50'
    }, 
    {
      id: 3,
      name: 'Donut',
      cost: '$2'
    },
    {
      id: 4,
      name: 'Fish',
      cost: '$5'
    }];

    

function renderRow(btDevice, {navigation}) {
    return (
        <View style={styles.tableRow} key={btDevice.id}>
            <View style={styles.tableCell}>
                <Text style={styles.cellText}>{btDevice.name}</Text>
            </View> 
            <View style={styles.tableCell}>
                <Text style={styles.cellText}>{btDevice.cost}</Text>
            </View> 
            <View style={styles.buttonCell}>
                <TouchableOpacity style={styles.connectButton}>
                <Text onPress={() => navigation.navigate('Wi-Fi Setup', {name: btDevice.name})}>
                Connect
                </Text>
            </TouchableOpacity>
            
            </View> 
        </View>
    );
}
  
export default function Bluetooth(navigation) {
    return (
    <View style={styles.tableContainer}>
        <View>
        <Text style={styles.titleBar}>Haruspex configuration app</Text>
        </View>    
        <View style={styles.table}>
        {
        data.map((dataRow) => { 
            return renderRow(dataRow, navigation);
        })
        }
        </View>
    </View>
    );   
}
 