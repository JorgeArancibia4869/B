import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DeepLinkingTrigger from './util/deep-linking-trigger';

const urlFromAlicePath2 = 'wptbobpr://path2';
const urlFromAlice = 'wptbobpr://';
console.log(`urlsFromAlice: "${urlFromAlice}" y "${urlFromAlicePath2}"`);

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