import { AsyncStorage } from 'react-native'

// load the current list from the db

const initialState = {

}

const CHECKING_LIST = 'CHECKING_LIST',
  DOWNLOAD_STARTED = 'DOWNLOAD_STARTED',
  DOWNLOAD_SONG = 'DOWNLOAD_SONG',
  DOWNLOAD_SONG_COMPLETE = 'DOWNLOAD_SONG_COMPLETE',
  DOWNLOAD_COMPLETE = 'DOWNLOAD_COMPLETE'

const reducer = () => {

}

const startDownloader = onProgress => dispatch => {
  // get last id of song


  // get the list of songs up to the last id/end/max <- we should cache this
}

export {
  reducer,
  startDownloader
}
