import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';

// const url = 'wptbobpr://path2'



export default function App() {

  React.useEffect( () => {
    Linking.getInitialURL().then(l => console.log("Todo bien", l)).catch(error => console.log(error))
  }, [])
  
  //Para recuperar la ruta y los parámetros
  // let dataRecived = Linking.parse(link)
  // alert(dataRecived.queryParams)

  return (
    <View style={styles.container}>
      <Text>Mock de Bob</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
