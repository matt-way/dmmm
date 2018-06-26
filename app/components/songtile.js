import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { THEME } from '../constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    paddingRight: 15
  },
  art: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: THEME.light,
    borderRadius: 2,
    marginLeft: 0
  },
  artSelected: {
    borderColor: THEME.selected
  },
  textContainer: {
    flex: 1,
    marginTop: 2,
    marginBottom: 2,
    paddingLeft: 15
  },
  titleText: {
    fontSize: 16,
    color: THEME.light,
    marginTop: 5
  },
  titleTextSelected: {
    color: THEME.selected
  },
  durationText: {
    color: '#bbb',
    marginTop: 5,
    marginLeft: 1,
    fontStyle: 'italic'
  }
})

const durationToString = duration => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration - minutes * 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const SongTile = ({ song, active, playPause, currentTime }) => (
  <TouchableOpacity onPress={() => playPause(song)}>
    <View style={styles.container}>
      <Image 
        style={[styles.art, active ? styles.artSelected : {}]}
        source={{uri: `https://img.youtube.com/vi/${song.youtube_id}/hqdefault.jpg` }}
      />
      <LinearGradient
        style={styles.textContainer}
        start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}
        colors={[active ? THEME.selected : THEME.dark, '#24201F']}
      >
        <Text style={[styles.titleText]}>{song.title}</Text>
        <Text style={styles.durationText}>{`${active ? durationToString(currentTime) + '/' : ''}${durationToString(song.duration)}`}</Text>
      </LinearGradient>
    </View>
  </TouchableOpacity>
)

export default SongTile