import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Linking from 'expo-linking';


const getParamsUrl = (link) => {
  console.log(link)
    //Para recuperar la ruta y los parámetros
    const reDeepLinkURL = /^(\w+)\:\/\/([^\?]*)(\?(.*))?$/;
    const matches = reDeepLinkURL.exec(link);
    const { schema, path, queryParamsStr } = { schema: matches[1], path: '/' + matches[2], queryParamsStr: matches[4] };
    let queryParams = {};
    if (queryParamsStr.length > 0) {
      queryParamsStr.split('&').forEach(pairStr => {
        const pair = pairStr.split('=');
        queryParams[pair[0]] = pair[1];
      })
    }
    //const { path, queryParams } = Linking.parse(link)
    console.log("path: ",path)
    console.log("queryParams: ", queryParams)
    return { schema, path, queryParams }
}

export default function App() {
  const urlFromAlicePath2 = 'wptbobpr://path2'; //Linking.createURL('path2', {}, 'wptbobpr')
  const urlFromAlice = 'wptbobpr://'; //Linking.createURL('', {}, 'wptbobpr')
  console.log(`urlsFromAlice: "${urlFromAlice}" y "${urlFromAlicePath2}"`);

  const [link, setLink] = React.useState('')
  const [path, setPath] = React.useState('')
  const [queryParams, setQueryParams] = React.useState({})
  const [outputs, setOutputs] = React.useState({})

  React.useEffect( () => {
    Linking.getInitialURL().then(l => {
      setLink(l)
      console.log("Todo bien", l)
      const {path, queryParams} = getParamsUrl(l)
      setPath(path)
      setQueryParams(queryParams)
    }).catch(error => console.log(error))

    if (!__DEV__) {
      // Linking.removeAllListeners("url");
      Linking.addEventListener('url', ( {url} ) => {
        console.log(`url: ${url}`)
        const {path, queryParams} = getParamsUrl(url)
        setLink(url)
        setPath(path)
        setQueryParams(queryParams)
        setOutputs({ urlFromListener: url, ...outputs })
      });

    }
  }, [])


  // alert(dataRecived.queryParams)
  
  return (
    <View style={styles.container}>
      <Text>Mock de Bob {__DEV__? '(Modo desarrollo/expoGo)' : '(Modo produccion/standalone)'}</Text>
      <Text>Link: {link}</Text>
      <Text>Path: {path}</Text>
      <Text>QueryParams: {JSON.stringify(queryParams, null, 4)}</Text>
      <Text>outputs: {JSON.stringify(outputs, null, 4)}</Text>
      {__DEV__? (
        <Button title="AutoOpen DeepLink" onPress={() => {
          Linking.openURL(`${link}/path2?param1=que&param2=tal`).then(() => console.log('auto-linking!!'));
        }}/>
      ) : null}
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
