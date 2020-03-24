import { State, Effect, Actions } from 'jumpstate'
import Sound from 'react-native-sound'
import RNFetchBlob from 'react-native-fetch-blob'

const { dirs } = RNFetchBlob.fs

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback')

const initialState = {
  playing: false,
  meta: null,
  song: null,
  progress: 0,
  err: null
}

const Player = State('player', {
  initial: initialState,
  play: (state, { meta, song }) => {
    return {
      playing: true,
      song,
      meta,
      progress: 0
    }
  },
  pause: (state, payload) => {
    return {
      ...state,
      playing: false
    }
  },
  stop: (state, payload) => {
    return {
      ...initialState
    }
  },
  playError: (state, { err }) => {
    return {
      ...state,
      err
    }
  },
  songCompleted: (state, payload) => state
})

const songCompleted = success => {
  Player.songCompleted()
  Actions.stopSong()
}

Effect('playSong', (payload, getState) => {
  const state = getState()
  const newMeta = payload.song
  const { song, meta } = state.player
  if(song && meta.youtube_id === newMeta.youtube_id){
    song.play(songCompleted)
  }else{
    if(song){ Actions.stopSong() }

    const path = dirs.DocumentDir
    const songPlayer = new Sound(newMeta.youtube_id, path, error => {
      if(error) {
        console.log('failed to load song:', error)
        Player.playError({ error })
        return
      }

      console.log('attempting to play song')
      songPlayer.play(songCompleted)
      Player.play({ song: songPlayer, meta: newMeta })
    })
  }  
})

Effect('stopSong', (payload, getState) => {
  const state = getState()
  const { song } = state.player
  if(song){
    song.stop()
    song.release()
    Player.stop()
  }
})

Effect('pauseSong', (payload, getState) => {
  const state = getState()
  const { song } = state.player
  if(song){
    song.pause()
    Player.pause()
  }
})

export default Player