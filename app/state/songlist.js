import { AsyncStorage } from 'react-native'
import { STORAGE_KEY } from '../constants'
import { createModel } from '../utils/redux-helpers'

const initialState = {
  loading: true,
  songs: [],
  scrollTo: null
}

const { actions, reducer } = createModel('SONGLIST', initialState, {
  loaded: [
    'songs',
    (state, { songs }) => ({
      ...initialState,
      loading: false,
      songs
    })
  ],
  songAdded: [
    'song',
    'position',
    (state, { song, position = 0 }) => ({
      ...state,
      songs: [
        ...state.songs.slice(0, position),
        song,
        ...state.songs.slice(position)
      ]
    })
  ],
  error: [
    'error',
    (state, { error }) => ({
      ...state,
      error
    })
  ],
  scrollTo: [
    'song',
    (state, { song }) => ({
      ...state,
      scrollTo: { song }
    })
  ]
})

const addSong = (id, song, previousId) => (dispatch, getState) => {
  // figure out the position to put the song in
  const position =
    getState().songlist.songs.findIndex(s => s.id === previousId) + 1
  dispatch(
    actions.songAdded(
      {
        id,
        ...song
      },
      position
    )
  )
  // persist the state back to the local storage when a song is added
  return AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(getState().songlist.songs)
  )
}

const init = () => dispatch => {
  // attempt to load the song list from memory
  //AsyncStorage.removeItem(STORAGE_KEY)
  return AsyncStorage.getItem(STORAGE_KEY)
    .then(list => {
      return list ? JSON.parse(list) : []
    })
    .then(songs => dispatch(actions.loaded(songs)))
    .catch(err => dispatch(actions.error({ err })))
}

export { init, addSong, actions, reducer }
