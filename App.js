import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Linking from 'expo-linking';


const urlFromAlicePath2 = 'wptbobpr://path2';
const urlFromAlice = 'wptbobpr://';
console.log(`urlsFromAlice: "${urlFromAlice}" y "${urlFromAlicePath2}"`);

class DeepLinkingTrigger {
  constructor(schema) {
    this.schema = schema
  }

  parseURL = (url) => {
    console.log(url)
      //Para recuperar la ruta y los parámetros
      const reDeepLinkURL = /^(\w+)\:\/\/([^\?]*)(\?(.*))?$/;
      const matches = reDeepLinkURL.exec(url);
      if (matches === null) {
        return { error: new Error(`Url inválida: ${url}`), url };
      }
      const { schema, path, queryParamsStr } = { schema: matches[1], path: '/' + matches[2], queryParamsStr: matches[4] };
      // Convertir el querystring en objeto queryParams
      let queryParams = {};
      if (queryParamsStr.length > 0) {
        queryParamsStr.split('&').forEach(pairStr => {
          const pair = pairStr.split('=');
          queryParams[pair[0]] = pair[1];
        })
      }
      console.log("parseURL::(schema, path, queryParams): ", schema, path, queryParams)
      // Validaciones finales
      let wasTriggered = false;
      if (scheme != this.schema) {
        return { error: new Error('Schema no corresponde al de esta aplicación.'), wasTriggered, scheme, path, queryParams, url };
      }
      if (path != '/') { wasTriggered = true; }
      if (queryParamsStr != '') { wasTriggered = true; }
      return { error: null, wasTriggered, schema, path, queryParams, url };
  }

  async getInitialURL() {
    const url = await Linking.getInitialURL();
    const { error, wasTriggered, scheme, path, queryParams, url } = this.parseAndAnalize(url);
    if (error) { return Promise.reject(error); }
    return Promise.resolve({ wasTriggered, scheme, path, queryParams, url, wasInitial: true });
  }

  getEventURL() {
    return new Promise((resolve, reject) => {
      Linking.addEventListener('url', ( {url} ) => {
        const { error, wasTriggered, scheme, path, queryParams, url } = this.parseAndAnalize(url);
        if (error) { return reject(error); }
        resolve({ wasTriggered, scheme, path, queryParams, url, wasInitial: false });
      });
    });
  }
}

const dlTrigger = new DeepLinkingTrigger('wptbobpr');

export default function App() {
  const [link, setLink] = React.useState('')
  const [path, setPath] = React.useState('')
  const [queryParams, setQueryParams] = React.useState({})
  const [outputs, setOutputs] = React.useState({})

  const setStates = ({ wasTriggered, scheme, path, queryParams, url }) => {
    setLink(url)
    setPath(path)
    setQueryParams(queryParams)
    setOutputs({ wasTriggered, urlFromListener: url, ...outputs })
  };
  const logError = error => console.log(error);

  React.useEffect( () => {
    dlTrigger.getInitialURL().then(setStates).catch(logError);

    if (!__DEV__) {
      dlTrigger.getEventURL().then(setStates).catch(logError);
    }
  }, [])

  
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
