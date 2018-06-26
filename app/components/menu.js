import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import { THEME } from '../constants'
import { playPause, nextSong, previousSong, toggleShuffle } from '../state/player'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.light
  },
  logo: {
    margin: 5,
    width: 40,
    height: 40,
    marginBottom: 30
  },
  icons: {
    textAlign: 'center',
    marginTop: 25
  }
})

const Menu = ({ songs, playing, shuffle, playPause, nextSong, previousSong, toggleShuffle }) => (
  <View style={styles.container}>
    <Image style={styles.logo} source={require('../../assets/icon.png')}/>
    <TouchableOpacity onPress={() => playPause()}>
      {playing
        ? <Icon style={styles.icons} name="pause" size={30} color={THEME.dark} />
        : <Icon style={styles.icons} name="play" size={30} color={THEME.dark} />
      }      
    </TouchableOpacity>
    <TouchableOpacity onPress={() => nextSong()}>
      <Icon style={styles.icons} name="skip-forward" size={30} color={THEME.dark} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => previousSong()}>
      <Icon style={styles.icons} name="skip-back" size={30} color={THEME.dark} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => toggleShuffle()}>
      <Icon 
        style={styles.icons} 
        name="shuffle" 
        size={30} 
        color={shuffle ? THEME.selected : THEME.dark} 
      />      
    </TouchableOpacity>
  </View>
)

const enhance = connect(({ player }) => ({
  playing: player.playing,
  shuffle: player.shuffle
}), {
  playPause,
  nextSong,
  previousSong,
  toggleShuffle
})

export default enhance(Menu)