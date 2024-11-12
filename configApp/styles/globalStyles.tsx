import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    cellText: {
      padding: 14,
    },
    buttonCell: {
      alignSelf: 'stretch',
      backgroundColor: '#fff',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      minWidth: '20%',
      justifyContent: 'center'
    },
    tableCell: {
      alignSelf: 'stretch',
      backgroundColor: '#fff',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      minWidth: '70%',
      justifyContent: 'center'
    },
    tableRow: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      height: 60,
    },
    table: {
      // alignItems: 'left',
      // justifyContent: 'left'
    },
    container: {
      flex: 1,
      backgroundColor: '#fffeee',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tableContainer: {
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
    connectButton: {
      backgroundColor: 'lightgreen',
      height: 30,    
      width: 70,
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