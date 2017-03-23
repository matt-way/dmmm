import React, { Component } from 'react'
import {
  View,
  Navigator,
  BackAndroid,
  StatusBar
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import Player from './scenes/Player'
import SongList from './scenes/SongList'

let _navigator

class DMMM extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
        />
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
            Navigator.SceneConfigs.FloatFromBottom}
          style={{flex:1}}
        />
      </View>
    )
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
  console.log(_navigator.getCurrentRoutes())
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false
  }
  _navigator.pop()
  return true
})

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

export default DMMM
