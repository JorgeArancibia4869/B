import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';


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
    Linking.getInitialURL().then(l => {
      setLink(l)
      console.log("Todo bien", l)
      const {path, queryParams} = getParamsUrl(l)
      setPath(path)
      setQueryParams(queryParams)
    }).catch(error => console.log(error))

    if (!__DEV__) {
      const urlFromAlicePath2 = Linking.createURL('path2', {}, 'wptbobpr')
      const urlFromAlice = Linking.createURL('', {}, 'wptbobpr')
      console.log("urlFromAlice",urlFromAlice)
      // Linking.removeAllListeners("url");
      Linking.addEventListener(urlFromAlice, ( {url} ) => {
        console.log("url1",url)
        const {path, queryParams} = getParamsUrl(url)
        setLink(url)
        setPath(path)
        setQueryParams(queryParams)
      })
      Linking.addEventListener(urlFromAlicePath2, ( {url} ) => {
        console.log("url2",url)
        const {path, queryParams} = getParamsUrl(url)
        setLink(url)
        setPath(path)
        setQueryParams(queryParams)
      })
    }
  }, [])


  // alert(dataRecived.queryParams)

  return (
    <View style={styles.container}>
      <Text>Mock de Bob</Text>
      <Text>Link: {link}</Text>
      <Text>Path: {path}</Text>
      <Text>QueryParams: {JSON.stringify(queryParams, null, 4)}</Text>
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
