import React, { Component } from 'react'
import { Actions } from 'jumpstate'
import { ListView, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import SongDownloader from '../components/SongDownloader'
import SongTile from '../components/SongTile'

class SongList extends Component {
  constructor() {
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  componentWillReceiveProps({ songs, player }) {
    console.log('in thingo')
    console.log(player)
    if(songs !== this.props.songs || this.props.player !== player){
      songs = songs || []
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(songs)
      })
    }
  }

  componentDidMount() {
    Actions.loadList()
      /*.then(() => {
        const { songs } = this.props
        const id = songs.length > 0 ? songs[0].youtube_id : undefined
        Actions.startSync(id)
      })
      .catch(err => {
        console.log(err)
      })*/
  }

  render() {
    const { navigator, songs = [], downloader, player } = this.props
    return (
      <View style={styles.listContainer}>
        {songs.length > 0 ?
          <ListView
            dataSource={this.state.dataSource}
            renderRow={song => {
              console.log('rendering row')
              console.log(song)
              return <SongTile song={song} playing={player.meta && song.youtube_id === player.meta.youtube_id} navigator={navigator}/>
            }}
          /> :
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No songs have been downloaded.</Text>
          </View>
        }
        {downloader.running && <SongDownloader downloaderState={downloader}/>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#000'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#fff'
  }
})

export default connect(state => ({
    songs: state.songlist.list,
    downloader: state.downloader,
    player: state.player
}))(SongList)

export {
  SongList
}
