import React, { Component } from 'react'
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  Image
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const SongTile = ({ song, navigator }) => (
  <TouchableHighlight style={styles.tile} onPress={() => navigator.push({ id: 'player' })}>
    <Image
      style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}
      source={{uri: song.image}}
    >
      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']} style={{flex: 1}}>
        <Text
          style={{color: '#eeeeee', marginBottom: 5, marginLeft: 8, fontFamily: 'sans-serif-condensed', fontSize: 18}}
        >{`${song.name} - ${song.duration}`}</Text>
    </LinearGradient>
    </Image>
  </TouchableHighlight>
)

const styles = StyleSheet.create({
  tile: {
    height: 130,
    marginHorizontal: 9,
    marginVertical: 5,
    //backgroundColor: '#0000ff'
  }
})

export default SongTile
