import { AsyncStorage } from 'react-native'
import { STORAGE_KEY } from './constants'

// redux action types
const SONGLIST_LOADING = 'SONGLIST_LOADING',
  SONGLIST_LOADED = 'SONGLIST_LOADED',
  SONGLIST_LOADING_ERROR = 'SONGLIST_LOADING_ERROR'

const listLoading = () => ({
  type: SONGLIST_LOADING
})
const listLoaded = list => ({
  list,
  type: SONGLIST_LOADED
})
const listError = error => ({
  error,
  type: SONGLIST_ERROR
})

// thunk actions
const loadList = (options = {}) => dispatch => {
  dispatch(listLoading())
  return AsyncStorage.getItem(STORAGE_KEY)
    .then(list => dispatch(listLoaded(list)))
    .catch(err => dispatch(listError(err)))
}

// reducer handlers
const handlers = {
  [SONGLIST_LOADING]: state => {
    const newState = {
      ...state,
      listLoading: true
    }
    delete newState.listLoadingError
    return newState
  },
  [SONGLIST_LOADED]: (state, { list }) => ({
    ...state,
    list,
    listLoading: false
  }),
  [SONGLIST_LOADING_ERROR]: (state, { error }) => ({
    ...state,
    listLoadingError: error,
    listLoading: false
  })
}

export {
  loadList,
  handlers
}
