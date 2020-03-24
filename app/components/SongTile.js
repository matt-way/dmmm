import React, { Component } from 'react'
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
  Dimensions,
  View
} from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import { Actions } from 'jumpstate'
import LinearGradient from 'react-native-linear-gradient'

const windowWidth = Dimensions.get('window').width
const { dirs } = RNFetchBlob.fs
console.log(dirs)

const durationToString = duration => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration - minutes * 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const SongTile = ({ song, playing, navigator }) => (
  <TouchableHighlight style={styles.tile} onPress={() => {
    if(playing){
      Actions.pauseSong()
    }else{
      Actions.playSong({ song })
    }    
  }}>
    <Image
      style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}
      source={{uri: `file://${dirs.DocumentDir}/${song.youtube_id}_art.jpg`}}
    >
      <View style={{
        alignItems: 'flex-start'
      }}>
        <Text style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          color: playing ? '#00ff00' : '#fff',
          fontWeight: 'bold',
          fontSize: 17,
          paddingVertical: 5,
          paddingHorizontal: 10,
          marginBottom: 20
        }}>{song.title}<Text style={{
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
