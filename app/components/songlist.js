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

const SongList = ({ songs, player, loading, playPause }) => {
  
  // hide any invalidsongs
  var showSongs = []
  if(songs){
    showSongs = songs.filter(s => s.valid)
  }

  return (
    <View style={styles.listContainer}>
      {showSongs.length > 0
        ? <FlatList
            data={showSongs}
            renderItem={
              ({item}) => <SongTile 
                song={item} 
                active={player.song && item.id === player.song.id} 
                playPause={playPause}
                currentTime={player.currentTime}
              />
            }
            extraData={player}
            keyExtractor={item => item.id}
          />
        : <View style={styles.emptyContainer}>
            {loading
              ? <ActivityIndicator animating={true}/>
              : <Text style={styles.emptyText}>No songs have been downloaded.</Text>
            }          
          </View>
      }
    </View>
  )
}

const enhance = connect(({ songlist, player }) => ({
  loading: songlist.loading,
  songs: songlist.songs,
  player
}), {
  playPause
})

export default enhance(SongList)