import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import SongTile from './songtile'
import { THEME } from '../constants'
import { playPause } from '../state/player'
import { actions } from '../state/songlist'

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#24201F',
    paddingTop: 5,
    paddingBottom: 5
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: THEME.light
  }
})

const ITEM_HEIGHT = 110

class SongList extends React.PureComponent {
  componentDidUpdate(prev) {
    if (prev.scrollSong !== this.props.scrollSong) {
      const realList = this.props.songs.filter(s => s.valid)
      this.flatListRef.scrollToIndex({
        index: realList.indexOf(this.props.scrollSong.song),
        viewOffset: 0,
        animated: true,
        viewPosition: 0.2
      })
    }
  }

  render() {
    const { songs, player, loading, playPause } = this.props

    // hide any invalidsongs
    var showSongs = []
    if (songs) {
      showSongs = songs.filter(s => s.valid)
    }

    return (
      <View style={styles.listContainer}>
        {showSongs.length > 0 ? (
          <FlatList
            data={showSongs}
            renderItem={({ item }) => (
              <SongTile
                song={item}
                active={player.song && item.id === player.song.id}
                playPause={playPause}
                currentTime={
                  player.song && item.id === player.song.id
                    ? player.currentTime
                    : 0
                }
              />
            )}
            extraData={player}
            keyExtractor={item => item.id}
            ref={ref => {
              this.flatListRef = ref
            }}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index
            })}
          />
        ) : (
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator animating={true} />
            ) : (
              <Text style={styles.emptyText}>
                No songs have been downloaded.
              </Text>
            )}
          </View>
        )}
      </View>
    )
  }
}

const enhance = connect(
  ({ songlist, player }) => ({
    loading: songlist.loading,
    songs: songlist.songs,
    player,
    scrollSong: songlist.scrollTo
  }),
  {
    playPause,
    scrollTo: actions.scrollTo
  }
)

export default enhance(SongList)
