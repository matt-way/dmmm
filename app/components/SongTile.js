import React, { Component } from 'react'
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
  Dimensions,
  View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const windowWidth = Dimensions.get('window').width

const durationToString = duration => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration - minutes * 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const SongTile = ({ song, navigator }) => (
  <TouchableHighlight style={styles.tile} onPress={() => navigator.push({ id: 'player' })}>
    <Image
      style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}
      source={{uri: song.image}}
    >
      <View style={{
        alignItems: 'flex-start'
      }}>
        <Text style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 17,
          paddingVertical: 5,
          paddingHorizontal: 10,
          marginBottom: 10
        }}>{song.name}<Text style={{
          color: '#aaa',
          fontStyle: 'italic',
          fontWeight: '100',
        }}> - {durationToString(song.duration)}</Text></Text>
      {/*}<Text style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: '#bbb',
          fontSize: 15,
          paddingBottom: 5,
          paddingTop: 0,
          paddingHorizontal: 10,
          marginBottom: 20
        }}>
          3:02
        </Text>*/}
      </View>
      {/*}
      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.0)']} style={{flex: 1}}>
        <Text
          style={{
            color: '#eeeeee',
            marginBottom: 5,
            marginLeft: 8,
            fontFamily: 'sans-serif-condensed',
            fontSize: 18,
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >{`${song.name} - ${song.duration}`}</Text>
    </LinearGradient>
    */}
    </Image>
  </TouchableHighlight>
)

const styles = StyleSheet.create({
  tile: {
    height: 0.5625 * windowWidth,
    marginHorizontal: 0,
    marginTop: 6,
    //backgroundColor: '#0000ff'
  }
})

export default SongTile
