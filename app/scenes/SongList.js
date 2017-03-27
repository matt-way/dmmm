import React, { Component } from 'react'
import { ListView, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import SongDownloader from 'app/components/SongDownloader'
import SongTile from 'app/components/SongTile'
import { loadList } from 'app/modules/songlist/init'
import { startSync } from 'app/modules/downloader/actions'

class SongList extends Component {
  constructor() {
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  componentWillReceiveProps({ songs }) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(songs)
    })
  }

  componentDidMount() {
    this.props.loadList().then(() => {
      this.props.startSync()
    })
  }

  render() {
    const { navigator, songs = [], downloader } = this.props
    return (
      <View style={styles.listContainer}>
        {songs.length > 0 ?
          <ListView
            dataSource={this.state.dataSource}
            renderRow={song => <SongTile song={song} navigator={navigator}/>}
          /> :
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No songs have been downloaded.</Text>
          </View>
        }
        {downloader.running && <SongDownloader/>}
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
  downloader: state.downloader
}), { loadList, startSync })(SongList)

export {
  SongList
}
