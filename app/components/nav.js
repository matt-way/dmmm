import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated
} from 'react-native'
import { connect } from 'react-redux'
import SideMenu from 'react-native-side-menu'
import Menu from './menu'
import SongList from './songlist'
import Downloader from './downloader'
import Conditional from './conditional'
import { actions } from '../state/menu'
import { THEME } from '../constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.dark
  }
})

const Nav = ({ menuOpen, openMenu, closeMenu, downloading }) => {
  
  const menu = <Menu/>
  const menuWidth = 50

  return (
    <View style={styles.container}>
      <SideMenu 
        menu={menu}
        isOpen={menuOpen}
        openMenuOffset={menuWidth}
        edgeHitWidth={menuWidth}
        bounceBackOnOverdraw={false}
        autoClosing={false}
        disableGestures={menuOpen}
        animationFunction={(prop, value) => Animated.timing(prop, {
          toValue: value,
          duration: 200
        })}
        onChange={open => {
          if(open){ 
            openMenu() 
          }else{
            closeMenu()
          }
        }}
      >
        <View style={styles.container}>
          <SongList/>
        </View>
      </SideMenu>
      <Conditional if={downloading}>
        <Downloader/>
      </Conditional>
    </View>
  ) 
}

const enhance = connect(({ menu, downloader }) => ({
  menuOpen: menu.open,
  downloading: downloader.running
}), {
  openMenu: actions.open,
  closeMenu: actions.close
})

export default enhance(Nav)