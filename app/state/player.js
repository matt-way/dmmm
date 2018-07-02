
import Sound from 'react-native-sound'
import RNFetchBlob from 'rn-fetch-blob'
import { createModel } from '../utils/redux-helpers'

const DIRS = RNFetchBlob.fs.dirs
Sound.setCategory('Playback')

var audioSingleton, tickInterval

const initialState = {
  playing: false,
  loading: false,
  song: null,
  shuffle: false,
  history: [],
  currentTime: 0
}

const { actions, reducer } = createModel('PLAYER', initialState, {
  load: ['song', (state, { song }) => ({
    ...state,
    loading: true,
    song
  })],
  loaded: state => ({
    ...state,
    loading: false,
    history: [...state.history, state.song],
    currentTime: 0
  }),
  play: state => ({
    ...state,
    playing: true
  }),
  pause: state => ({
    ...state,
    playing: false
  }),
  popHistory: state => ({
    ...state,
    history: [...state.history.slice(0, state.history.length - 2)]
  }),
  toggleShuffle: state => ({
    ...state,
    shuffle: !state.shuffle
  }),
  updateTime: ['seconds', (state, { seconds }) => ({
    ...state,
    currentTime: Math.floor(seconds)
  })]
})


const loadAudio = filename => new Promise((resolve, reject) => {
  if(audioSingleton){
    audioSingleton.release()
    audioSingleton = null
  }

  if(tickInterval){
    clearInterval(tickInterval)
    tickInterval = null
  }
  
  audioSingleton = new Sound(filename, Sound.MAIN_BUNDLE, error => {
    if(error){
      reject(error)
    }else{
      resolve(audioSingleton)
    }
  })
})

const playAudio = () => new Promise((resolve, reject) => {
  if(!audioSingleton){ return reject('audio not loaded') }

  audioSingleton.play((success) => {
    if(success){
      resolve(audioSingleton)
    }else{
      audioSingleton.reset()
      reject('playback of sound failed')
    }
  })
})

const playPause = song => (dispatch, getState) => {

  const { player, songlist } = getState()
  const currentSong = player.song
  const songs = songlist.songs

  if(!song && !currentSong){
    if(songs.length > 0){
      song = songs[0]
    }else{
      return Alert.alert('No song available', 'There are no songs downloaded to play.')
    }
  }

  // if the player is loading do nothing as it is attempting to play anyway
  if(player.loading){ return }

  // simply toggle play pause if not loading a new song
  if(!song || (currentSong && song.id === currentSong.id)){
    if(player.playing){
      dispatch(actions.pause())
      audioSingleton.pause()
    }else{
      dispatch(actions.play())
      playAudio().then(() => {
        dispatch(nextSong())
      })
    }
    return
  }else{
    // song needs to be reloaded
    dispatch(actions.load(song))
    return loadAudio(`${DIRS.DocumentDir}/${song.youtube_id}.mp3`)
      .then(() => {
        dispatch(actions.loaded())
        dispatch(actions.play())
        playAudio().then(() => {
          dispatch(nextSong())
        })

        // set timer for getting the current song time
        tickInterval = setInterval(() => {
          if(audioSingleton){
            audioSingleton.getCurrentTime(seconds => {
              dispatch(actions.updateTime(seconds))
            })
          }
        }, 250)
      })
  }
}

const randArrayItem = arr => arr[Math.floor(Math.random() * arr.length)]

const nextSong = () => (dispatch, getState) => {
  const { player, songlist } = getState()
  const songs = songlist.songs.filter(s => s.valid)

  if(songs.length > 1){
    if(player.shuffle){
      var song = randArrayItem(songs)
      if(player.song){
        while(player.song.id === song.id){
          song = randArrayItem(songs)
        }
      }
      dispatch(playPause(song))
    }else if(player.song){
      var nextIndex = songs.findIndex(s => s.id === player.song.id) + 1
      if(nextIndex >= songs.length){ nextIndex = 0 }
      dispatch(playPause(songs[nextIndex]))
    }
  }else if(!player.song && songs.length === 1){
    dispatch(playPause(songs[0]))
  }  
}

const previousSong = () => (dispatch, getState) => {
  const { player } = getState()
  if(player.history.length > 1){
    const song = player.history[player.history.length - 2]
    dispatch(actions.popHistory())
    dispatch(playPause(song))
  }
}

const toggleShuffle = () => (dispatch, getState) => {
  dispatch(actions.toggleShuffle())
}

export {
  playPause,
  nextSong,
  previousSong,
  toggleShuffle,
  reducer
}