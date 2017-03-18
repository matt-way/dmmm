import React, { Component } from 'react'
import {
  AppRegistry,
  Navigator,
  BackAndroid
} from 'react-native'
import Player from './app/scenes/Player'
import SongList from './app/scenes/SongList'

let _navigator

BackAndroid.addEventListener('hardwareBackPress', () => {
  console.log(_navigator.getCurrentRoutes())
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false
  }
  _navigator.pop()
  return true
})

const dmmm = props => {

  return (
    <Navigator
      initialRoute={{ id: 'list' }}
      renderScene={(route, navigator) => {
        _navigator = navigator
        if(route.id === 'list'){
          return <SongList navigator={navigator}/>
        }else if(route.id === 'player'){
          return <Player navigator={navigator}/>
        }
      }}
      configureScene={(route, routeStack) =>
        Navigator.SceneConfigs.VerticalUpSwipeJump}
      style={{flex:1}}
    />
  )
}



/*const styles = StyleSheet.create({
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
});*/

AppRegistry.registerComponent('dmmm', () => dmmm);
