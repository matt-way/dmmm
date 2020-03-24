import React, { Component } from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
//import thunk from 'redux-thunk'
import SplashScreen from 'react-native-splash-screen'
import reducers from './reducers'
import DMMM from './DMMM'
import { CreateJumpstateMiddleware } from 'jumpstate'

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(CreateJumpstateMiddleware())
)

class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <DMMM />
      </Provider>
    )
  }
}

export default App
