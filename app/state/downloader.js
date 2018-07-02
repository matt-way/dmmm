
import {
  Alert
} from 'react-native'
import { SONGS_URL, AUDIO_API_URL } from '../constants'
import RNFetchBlob from 'rn-fetch-blob'
import { createModel } from '../utils/redux-helpers'
import { addSong } from './songlist'

const DIRS = RNFetchBlob.fs.dirs

const initialState = {
  running: false,
  song: null,
  received: 0,
  total: 100
}

const { actions, reducer } = createModel('DOWNLOADER', initialState, {
  started: state => ({
    ...initialState,
    running: true
  }),
  songStarted: ['song', (state, { song }) => ({
    ...state,
    song
  })],
  songProgress: ['received', 'total', (state, { received, total }) => ({
    ...state,
    received,
    total
  })],
  songComplete: state => ({
    ...state,
    song: null,
    received: 0
  }),
  complete: state => ({
    ...initialState
  }),
  error: ['error', (state, { error }) => ({
    ...state,
    error
  })]
})

const promiseQuestion = () => new Promise((resolve, reject) => {
  Alert.alert(
    'Check for song updates?',
    'Would you like to download any new songs if they are available?',
    [
      { text: 'No', onPress: () => resolve(false), style: 'cancel' },
      { text: 'Yes', onPress: () => resolve(true) },
    ],
    { cancelable: false }
  )
})

const downloadArt = song => dispatch => {
  return RNFetchBlob
    .config({
      path: `${DIRS.DocumentDir}/${song.youtube_id}_art.jpg`
    })
    .fetch('GET', `https://img.youtube.com/vi/${song.youtube_id}/hqdefault.jpg`, {})
}

const downloadAudio = song => dispatch => {
  const filename = `${DIRS.DocumentDir}/${song.youtube_id}.mp3`
  return RNFetchBlob
    .config({
      path: filename
    })
    .fetch('GET', `${AUDIO_API_URL}${song.youtube_id}`, {})
    .progress((received, total) => {
      dispatch(actions.songProgress(received, total))
    })
    .then(() => RNFetchBlob.fs.stat(filename))
    .then(({ size }) => size > (1024 * 100))
}

const downloadSong = (id, song, previousId) => (dispatch, getState) => {
  // dispatch song download started
  dispatch(actions.songStarted(song))
  // do song download and progress
  return dispatch(downloadArt(song))
    .then(() => dispatch(downloadAudio(song)))
    .then(success => {
      song.valid = success
      dispatch(addSong(id, song, previousId))
      dispatch(actions.songComplete())
    })
}

const downloadCheck = () => (dispatch, getState) => {

  // get the latest songs from firebase
  return fetch(SONGS_URL)
    .then((response) => response.json())
    .then(allSongs => {
      const { songs } = getState().songlist
      const allIds = Object.keys(allSongs).reverse()
      
      return promiseQuestion().then(shouldDownload => {
        if(shouldDownload){
          dispatch(actions.started())
          // go through each song in the correct order,
          // setting up downloading info
          var chain = Promise.resolve()
          allIds.forEach((id, index) => {
            const findSong = songs.find(s => s.id === id)

            // if song is missing or invalid attempt a download
            if(!findSong || !findSong.valid){
              chain = chain.then(() => {
                const previousId = index > 0 ? allIds[index - 1] : null
                return dispatch(downloadSong(id, allSongs[id], previousId))
              })
            }
          })
          chain.then(() => dispatch(actions.complete()))
          return chain
        }
      })
    })
}

export {
  downloadCheck,
  reducer
}
