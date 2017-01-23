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
  ViewPagerAndroid
} from 'react-native';

import YouTube from './YouTube';

import Swiper from 'react-native-swiper';


var dmmm = React.createClass({
  render: function() {
    return (
      <ViewPagerAndroid
      style={styles.container}
      initialPage={1}>
      
        <View style={styles.other}>
          <Text style={styles.instructions}>Beautiful</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
            To get started, edit index.android.js
          </Text>
          <Text style={styles.instructions}>
            Double tap R on your keyboard to reload,{'\n'}
            Shake or press menu button for dev menu
          </Text>
          <YouTube
            videoId="KVZ-P-ZI6W4"
            play={true}
            hidden={true}
            playsInline={true}
            showinfo={false}
            controls={0}
            apiKey={'AIzaSyDqc8oEwl5CbXC0-9zVkfJheLwMihACrG8'}          
            style={{alignSelf: 'stretch', height: 250, backgroundColor: 'black', marginVertical: 10}}
          />
        </View>
      </ViewPagerAndroid>
    )
  }
});


const styles = StyleSheet.create({
  wrapper: {},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000'
  },
  other: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000FF'
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
});

/*
class dmmm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
        <YouTube
          videoId="KVZ-P-ZI6W4"
          play={true}
          hidden={true}
          playsInline={true}
          showinfo={false}
          controls={0}
          apiKey={'AIzaSyDqc8oEwl5CbXC0-9zVkfJheLwMihACrG8'}          
          style={{alignSelf: 'stretch', height: 250, backgroundColor: 'black', marginVertical: 10}}
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
    backgroundColor: '#FF0000'
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
});
*/
AppRegistry.registerComponent('dmmm', () => dmmm);
