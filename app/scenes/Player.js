import React, { Component } from 'react'
import RNFS from 'react-native-fs'
import { View, Text, StyleSheet, Image } from 'react-native'
import ExtraDimensions from 'react-native-extra-dimensions-android'
import Sound from 'react-native-sound'
import Swiper from 'react-native-swiper'

const test = ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT')
console.log(test)

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback')

var styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  slide1: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    //backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

class Loading extends Component {
  componentDidMount() {
    /*setTimeout(() => {
      this.props.navigator.pop()
    }, 2000)*/

    const id = 'EF_WKwbueG8'
    const path = RNFS.DocumentDirectoryPath

    /*
    const result = RNFS.downloadFile({
      fromUrl: `http://dmmm-server.herokuapp.com/${id}`,
      toFile: path + '/' + id,
      background: true, // ios only - must enable background fetch
      backgroundDivider: 50, // make higher to reduce progress calls
      begin: details => {
        console.log('beginning')
      },
      progress: details => {
        console.log(details)
      }
    })

    const { jobId, promise } = result
    promise.then(result => {
      console.log('file downloaded')
      console.log(result.statusCode, result.bytesWritten)
    })
    */

    /*
    const song = new Sound(id, path, error => {
      if(error) {
        console.log('failed to load song:', error)
        return
      }
      console.log('attempting to play song')
      song.play(success => {
        console.log('song completed')
      })

      setTimeout(() => {
        console.log('attempting to stop')
        song.stop()
        song.release()
      }, 5000)
    })
    */
  }

  render() {
    const { navigator } = this.props

    return (
      <Swiper
        style={styles.wrapper}
        loop={false}
        showsPagination={false}
      >
        <View style={{flex:1, marginBottom: test, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'flex-end'}}>
          <Text>TEST TEXT</Text>
        </View>
        {/*}<View style={styles.slide1}>
          <Image
            style={{flex: 1, marginBottom: 26, flexDirection: 'row', alignItems: 'flex-end'}}
            source={{uri: 'http://www.phoca.cz/demo/images/phocagallery/shadowbox/thumbs/phoca_thumb_l_alps-5.jpg'}}
          >
            <Text style={styles.text}>Hello Swiper</Text>
          </Image>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>Beautiful</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>And simple</Text>
        </View>*/}
      </Swiper>
    )
  }
}

export default Loading
