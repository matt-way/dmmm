import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
//import ProgressBar from 'react-native-progress-bar'

const windowWidth = Dimensions.get('window').width

class SongDownloader extends Component {

  /*onProgress(data) {
    setState(data)
  }

  onProgress(details) {
    // update the internal state just for progress events

  }*/

  componentDidMount() {
    // start the downloading process
    //startDownloading(this.onProgress)


    // start the downloading process
    /*downloader.start(onProgress, onSongCompleted)
      .then(() => this.props.finished())
      .catch(err =>*/

    // pass in callbacks for song progress or just for an update
  }

  render() {
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
          <Text style={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: 15,
            marginTop: 6
          }}>Downloading - This is the song name</Text>
        <Text style={{
            color: '#ccc',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: 15,
            marginTop: 0
          }}>30%</Text>
          <View style={{
            position: 'absolute',
            height: 5,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
            <View style={{
              backgroundColor: '#fff',
              width: 0.9 * windowWidth,
              height: 5
            }}></View>
          </View>
      </LinearGradient>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  }
})

export default SongDownloader//connect()
