import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Conditional from './conditional'
import { THEME } from '../constants'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    left: 15,
    height: 60,
    borderRadius: 5
  },
  title: {
    color: THEME.light,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
    marginTop: 10,
    paddingHorizontal: 10
  },
  progressText: {
    color: THEME.light,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
    marginTop: 0
  },
  spinner: {
    marginTop: 18
  }
})

const Downloader = ({ song, received, total }) => {
  console.log(song)
  return(
  <LinearGradient 
    start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}
    colors={['#ad58cc', '#ef5952']}
    style={styles.container}
  >
    {song
      ? [<Text key="0" numberOfLines={1} style={styles.title}>Downloading {song.title}</Text>,
         <Text key="1" style={styles.progressText}>{Math.floor(received / total * 100)}%</Text>]
      : <ActivityIndicator animating={true} style={styles.spinner}/>
    }
  </LinearGradient>
)}

const enhance = connect(({ downloader }) => ({
  received: downloader.received,
  total: downloader.total,
  song: downloader.song
}))

export default enhance(Downloader)

//