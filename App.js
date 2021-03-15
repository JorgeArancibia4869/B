import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';

let urlG = ''
Linking.getInitialURL().then(l => {
  console.log("Todo bien", l)
  urlG = l
}).catch(error => console.log(error))

const getParamsUrl = (link) => {
  console.log(link)
    //Para recuperar la ruta y los parámetros
    const { path, queryParams } = Linking.parse(link)
    console.log("path: ",path)
    console.log("queryParams: ", queryParams)
    return { path, queryParams }
}

export default function App() {
  const [path, setPath] = React.useState('')
  const [queryParams, setQueryParams] = React.useState({})

  const [link, setLink] = React.useState('')
  
  React.useEffect( () => {
    setLink(urlG)
    console.log("urlG:",urlG)


    // const {path, queryParams} = getParamsUrl(urlG)
    // setPath(path)
    // setQueryParams(queryParams)

    if (!__DEV__) {
      const urlFromAlice = Linking.createURL('path2', {}, 'wptbobpr')
      console.log("urlFromAlice",urlFromAlice)
      // Linking.removeAllListeners("url");
      Linking.addEventListener(urlFromAlice, ( {url} ) => {
        console.log("url",url)
        urlG = url
        // const {path, queryParams} = getParamsUrl(url)
        setLink(urlG)
        // setPath(path)
        // setQueryParams(queryParams)
      })
    }
  }, [])


  // alert(dataRecived.queryParams)

  return (
    <View style={styles.container}>
      <Text>Mock de Bob</Text>
      <Text>Link: {link}</Text>
      {/* <Text>Path: {path}</Text> */}
      {/* <Text>QueryParams: {queryParams}</Text> */}
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
