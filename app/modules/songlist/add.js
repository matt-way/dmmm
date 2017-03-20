import { AsyncStorage } from 'react-native'
import { STORAGE_KEY } from './constants'

const SONG_ADDING = 'SONG_ADDING',
  SONG_ADDED = 'SONG_ADDED',
  SONG_ADDED_ERROR = 'SONG_ADDED_ERROR'

const songAdding = () => ({
  type: SONG_ADDING
})
const songAdded = song => ({
  song,
  type: SONG_ADDED
})
const songAddedError = error => ({
  error,
  type: SONG_ADDED_ERROR
})

const addSong = song => dispatch => {
  dispatch(songAdding())
  // do a list replace
  return AsyncStorage.getItem(STORAGE_KEY)
    .then(stringList => {
      const newList = JSON.parse(stringList).unshift(song)
      return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
    })
    .then(() => dispatch(songAdded(song)))
    .catch(err => dispatch(songAddedError(err)))
}

const handlers = {
  [SONG_ADDING]: state => {
    const newState = {
      ...state,
      addingSong: true
    }
    delete newState.addingSongError
    return newState
  },
  [SONG_ADDED]: (state, { song }) => ({
    ...state,
    list: [song, ...state.list]
  }),
  [SONG_ADDED_ERROR]: (state, { error }) => ({
    ...state,
    addingSongError: error
  })
}

export {
  addSong,
  handlers
}
