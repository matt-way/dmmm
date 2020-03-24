import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const windowWidth = Dimensions.get('window').width

class SongDownloader extends Component {

  render() {
    const { downloaderState } = this.props
    const { song, received, total, downloadingArt } = downloaderState
    let downloaderText
    if(song){
      if(downloadingArt){
        downloaderText = `Downloading (Art): ${song.title}`
      }else{
        downloaderText = `Downloading: ${song.title}`
      }
    }else{
      downloaderText = 'Syncing Songlist With Server'
    }
    const percent = received / total

    return (
      <View style={{
        backgroundColor:'#f5ebe1',
        height: 60,
        marginBottom: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#000'
      }}>
        <LinearGradient
          start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}
          colors={['#ad58cc', '#ef5952']}
          style={styles.linearGradient}
        >
          <Text numberOfLines={1} style={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: 15,
            marginTop: 6,
            paddingHorizontal: 10
          }}>{downloaderText}</Text>
          {song &&
            [<Text key="a" style={{
              color: '#ccc',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: 15,
              marginTop: 0
            }}>{Math.floor(percent * 100)}%</Text>,
            <View key="b" style={{
              position: 'absolute',
              height: 5,
              left: 0,
              right: 0,
              bottom: 0,
            }}>
              <View style={{
                backgroundColor: '#fff',
                width: percent * windowWidth,
                height: 5
              }}></View>
            </View>]
          }
          {!song &&
            <ActivityIndicator
              animating={true}
              style={styles.spinner}
            />
          }
        </LinearGradient>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  },
  spinner: {
    marginTop: 5
  }
})

export default SongDownloader
