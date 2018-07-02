import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import { THEME } from '../constants'
import { actions as menuActions } from '../state/menu'
import { playPause, nextSong, previousSong, toggleShuffle } from '../state/player'
import Condtional from './conditional'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 15,
    backgroundColor: THEME.light,
    //width: 240,
    height: 50,
    borderRadius: 3,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5
  },
  logoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 5,
    backgroundColor: THEME.light
  },
  logo: {
    width: 40,
    height: 40
  },
  icons: {
    padding: 6
  }
})

/*
const Controls = ({ downloading }) => (
  <View style={[styles.container, { bottom: downloading ? 90 : 15 }]}>
    <Image style={styles.logo} source={require('../../assets/icon.png')}/>
  </View>
)*/
class Controls extends React.Component {
  state = {
    widthAnim: new Animated.Value(50),
    opacityAnim: new Animated.Value(0)
  }

  render() {
    const { downloading, songs, playing, shuffle, playPause, nextSong, previousSong, toggleShuffle, menuOpen, openMenu, closeMenu } = this.props
    const { widthAnim, opacityAnim } = this.state

    return (
      <Animated.View style={[styles.container, { bottom: downloading ? 90 : 15, width: widthAnim }]}>
        <Condtional if={menuOpen}>
          <TouchableOpacity onPress={() => previousSong()}>
            <Icon style={styles.icons} name="skip-back" size={30} color={THEME.dark} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playPause()}>
            {playing
              ? <Icon style={styles.icons} name="pause" size={30} color={THEME.dark} />
              : <Icon style={styles.icons} name="play" size={30} color={THEME.dark} />
            }      
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nextSong()}>
            <Icon style={styles.icons} name="skip-forward" size={30} color={THEME.dark} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleShuffle()}>
            <Icon 
              style={styles.icons} 
              name="shuffle" 
              size={30} 
              color={shuffle ? THEME.selected : THEME.dark} 
            />      
          </TouchableOpacity>
        </Condtional>
        <TouchableOpacity style={styles.logoButton} onPress={() => {
          if(menuOpen){
            closeMenu()
            Animated.timing(this.state.widthAnim, {
              toValue: 50,
              duration: 300,
            }).start()
          }else{
            Animated.timing(this.state.widthAnim, {
              toValue: 240,
              duration: 300,
            }).start(() => {
              openMenu()
            })
          }
        }}>
          <Image style={styles.logo} source={require('../../assets/icon.png')}/>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const enhance = connect(({ player, menu, downloader }) => ({
  playing: player.playing,
  shuffle: player.shuffle,
  menuOpen: menu.open,
  downloading: downloader.running
}), {
  playPause,
  nextSong,
  previousSong,
  toggleShuffle,
  openMenu: menuActions.open,
  closeMenu: menuActions.close
})

export default enhance(Controls)
