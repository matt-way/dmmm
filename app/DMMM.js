import React, { Component } from 'react'
import {
  View,
  Navigator,
  BackAndroid,
  StatusBar
} from 'react-native'
import Player from './scenes/Player'
import SongList from './scenes/SongList'

let _navigator

const DMMM = props => (
  <View style={{flex: 1, backgroundColor: '#000'}}>
    <StatusBar
      backgroundColor="black"
      barStyle="light-content"
    />
    <Navigator
      style={{flex:1}}
      configureScene={(route, routeStack) =>
        Navigator.SceneConfigs.FloatFromBottom}
      initialRoute={{ id: 'list' }}
      renderScene={(route, navigator) => {
        _navigator = navigator
        if(route.id === 'list'){
          return <SongList navigator={navigator}/>
        }else if(route.id === 'player'){
          return <Player navigator={navigator}/>
        }
      }}
    />
  </View>
)

BackAndroid.addEventListener('hardwareBackPress', () => {
  console.log(_navigator.getCurrentRoutes())
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false
  }
  _navigator.pop()
  return true
})

export default DMMM
