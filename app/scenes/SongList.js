import React, { Component } from 'react'
import { ListView, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import SongDownloader from 'app/components/SongDownloader'
import SongTile from 'app/components/SongTile'
import LinearGradient from 'react-native-linear-gradient'
//import { loadList } from 'app/modules/songlist/init'
//import { startSync } from 'app/modules/downloader/actions'

const genDummy = n => {
  const output = []
  for(var i=0; i<n; i++){
    output.push({
      name: 'Some Name Test',
      //image: `http://www.phoca.cz/demo/images/phocagallery/shadowbox/thumbs/phoca_thumb_l_alps-${(i%5)+1}.jpg`,
      image: 'http://img.youtube.com/vi/CgYTK2fxHw8/maxresdefault.jpg',
      duration: Math.floor(Math.random() * 200)
    })
  }
  return output
}

class SongList extends Component {
  constructor() {
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(genDummy(40))
    }
  }

  /*componentDidMount() {
    this.props.loadList().then(() => {
      this.props.startSync()
    })
  }*/

  render() {
    const { navigator } = this.props
    return (

        <LinearGradient colors={['#000', '#000']} style={styles.linearGradient}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={song => <SongTile song={song} navigator={navigator}/>}
          />
          <SongDownloader/>
        </LinearGradient>

    )
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  }
})

/*
export default connect(null, { startSync })(SongList)

export {
  SongList
}*/
export default SongList
