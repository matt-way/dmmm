/*
  DMMM Entry Point
*/
import React, { Component } from 'react'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { reducer as songlist, init } from './app/state/songlist'
import { reducer as downloader, downloadCheck } from './app/state/downloader'
import { reducer as menu } from './app/state/menu'
import { reducer as player } from './app/state/player'
import Nav from './app/components/nav'
import SplashScreen from 'react-native-splash-screen'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  combineReducers({
    songlist,
    downloader,
    menu,
    player
  }),
  composeEnhancers(applyMiddleware(thunk))
)

class App extends Component {
  componentDidMount() {
    SplashScreen.hide()
    store.dispatch(init()).then(() => {
      // run downloader check after initial load, but just run
      // async to regular process
      if(!store.getState().downloader.running){
        store.dispatch(downloadCheck())
      }
    })
  }

  render() {
    return (
      <Provider store={store}>
        <Nav/>
      </Provider>
    )
  }
}

export default App
