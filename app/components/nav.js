import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import Controls from './controls'
import SongList from './songlist'
import Downloader from './downloader'
import Conditional from './conditional'
import { THEME } from '../constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.dark
  }
})

const Nav = ({ menuOpen, openMenu, closeMenu, downloading }) => (
  <View style={styles.container}>
    <SongList/>
    <Controls/>
    <Conditional if={downloading}>
      <Downloader/>
    </Conditional>
  </View>
)

export default Nav