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
      minWidth: '25%',
      justifyContent: 'center'
    },
    placeholderStyle: {
      fontSize: 16,
    },
    tableCell: {
      alignSelf: 'stretch',
      backgroundColor: '#fff',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      minWidth: '75%',
      justifyContent: 'center'
    },
    tableRow: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      height: 60,
    },
    table: {
      // flex: 0,
      backgroundColor: '#555',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%'
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    pageBody: {
      width: '100%',
      height: '100%',
      // alignItems: 'center',
      // flex: 1,
      // justifyContent: 'center',
    },
    container: {
      // flex: 1,
      // backgroundColor: '#fffeee',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
    },
    button: {
      backgroundColor: 'lightgreen',
      height: 50,    
      width: 130,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 3,
      borderRightWidth: 3
    },
    openButton: {
      backgroundColor: 'lightblue',
      height: 50,    
      width: 130,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 3,
      borderRightWidth: 3,
      marginLeft: 10
    },
    connectButton: {
      backgroundColor: 'lightgreen',
      height: 30,    
      width: 70,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderRightWidth: 1
    },
    titleBar: {
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
    },
    fieldSet:{
      margin: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      alignItems: 'left',
      borderColor: '#000',
      minWidth: '90%',
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
      minHeight: 50,
      // margin: 5,
      flex: 1,
      padding: 10,
      fontSize: 20
    },
    selectedTextStyle: {
      fontSize: 20,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 20,
    },
    dropdown: {
      height: 50,
      paddingHorizontal: 8,
      minWidth: '95%'
    },
  });