/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

export default class dmmm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 200, width: '100%', backgroundColor: 'skyblue'}}>
          <Text style={styles.welcome}>
            Welcome to React Native
          </Text>
        </View>
        <WebView
          source={{uri: 'https://www.youtube.com/embed/PGUMRVowdv8'}}
          style={styles.video}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  video: {
    marginTop: 20,
    maxHeight: 200,
    width: 320,
    flex: 1
  }
});

AppRegistry.registerComponent('dmmm', () => dmmm);
