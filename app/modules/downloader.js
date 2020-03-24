import { Alert } from 'react-native'
import { State, Effect, Actions } from 'jumpstate'
import RNFetchBlob from 'react-native-fetch-blob'
import initClient from 'app/graphql_client'
import { 
  CHURN_API_URL, 
  AUDIO_API_URL,
  CHANNEL_SLUG,
  MAX_SONGS
} from 'app/constants'

const { dirs } = RNFetchBlob.fs

const gqlClient = initClient({
  url: CHURN_API_URL
})

const initialState = {
  running: false,
  song: null,
  task: null,
  received: 0,
  total: 100,
  error: null,
  downloadingArt: false
}

const Downloader = State('downloader', {
  initial: initialState,
  downloaderStarted: (state, payload) => {
    return {
      ...state,
      running: true
    }
  },
  downloadSongArtStarted: (state, { song, task }) => {
    return {
      ...state,
      song,
      task,
      downloadingArt: true
    }
  },
  downloadSongArtProgress: (state, { received, total }) => {
    return {
      ...state,
      received,
      total
    }
  },
  downloadSongArtComplete: (state, payload) => {
    return {
      ...state,
      downloadingArt: false,
      task: null,
      received: 0,
      total: 100,
    }
  },
  downloadSongStarted: (state, { song, task }) => {
    return {
      ...state,
      song,
      task
    }
  },
  downloadSongProgress: (state, { received, total }) => {
    return {
      ...state,
      received,
      total
    }
  },
  downloadSongComplete: (state, payload) => {
    return {
      ...state,
      song: null,
      task: null
    }
  },
  downloaderError: (state, { err }) => {
    return {
      ...initialState,
      err
    }
  },
  downloaderComplete: (state, payload) => {
    return {
      ...initialState
    }
  },
  downloaderCancel: (state, payload) => {
    return {
      ...initialState
    }
  },
})

// graphql query for getting a list of songs from a channel
const songlistQuery = (first, cursor) => {
  if(cursor){
    const { youtube_id, channel_position } = cursor
    const channel_id = CHANNEL_SLUG
    return gqlClient.query(`
      query {
        channel(slug: "${CHANNEL_SLUG}"){
          videos(first: ${first}, cursor: {
            channel_id: "${channel_id}"
            youtube_id: "${youtube_id}"
            channel_position: ${channel_position}
          }){
            edges{
              video{
                youtube_id
                title
                duration
                channel_position
              }
            }
          }
        }
      }
    `)
  }else{
    return gqlClient.query(`
      query {
        channel(slug: "${CHANNEL_SLUG}"){
          videos(first: ${first}){
            edges{
              video{
                youtube_id
                title
                duration
                channel_position
              }
            }
          }
        }
      }
    `)
  }
}

// a recursive list builder for finding songs going backwards
// through time
const buildList = (id, data, list) => {
  const videos = data.channel.videos.edges.map(v => v.video)
  const currentIndex = videos.findIndex(i => i.youtube_id === id)
  if(videos.length <= 0){
    return list
  }else if(currentIndex >= 0){
    return list.concat(videos.slice(0, currentIndex))
  }else if(list.length + videos.length >= MAX_SONGS){
    return list.concat(videos)
  }else{
    return songlistQuery(30, videos[videos.length - 1])
      .then(({ data }) => buildList(id, data, list.concat(videos)))
  }
}

// get a list of songs in the past up to a most recent id, or
// when a limit is hit 
const getListToAdd = mostRecentId => {
  return songlistQuery(30).then(({ data }) => buildList(mostRecentId, data, []))
}

const downloadSongArt = song => {
  console.log('downloading art:')
  console.log(song)
  const task = RNFetchBlob
    .config({
      path : `${dirs.DocumentDir}/${song.youtube_id}_art.jpg`
    })
    .fetch('GET', `https://img.youtube.com/vi/${song.youtube_id}/hqdefault.jpg`)
    .progress({ count : 25 }, (received, total) => {
      console.log('art progress', received / total)
      Downloader.downloadSongArtProgress({ received, total })
    })
    .then(() => {
      Downloader.downloadSongArtComplete()
    })
  Downloader.downloadSongArtStarted({ song, task })
  return task
}

// util function for downloading a single song (and song image)
const downloadSong = song => {
  console.log('downloading song:')
  console.log(song)
  const task = RNFetchBlob
    .config({
      path : `${dirs.DocumentDir}/${song.youtube_id}`
    })
    .fetch('GET', `${AUDIO_API_URL}${song.youtube_id}`)
    .progress({ count : 25 }, (received, total) => {
      console.log('song progress', received / total)
      Downloader.downloadSongProgress({ received, total })
    })
    .then(() => Downloader.downloadSongComplete())
  Downloader.downloadSongStarted({ song, task })
  return task
}

Effect('startSync', mostRecentId => {
  Downloader.downloaderStarted()
  // using the most recent id in the song list figure out if songs
  // need to be downloaded by querying the api and figuring out the difference
  return getListToAdd(mostRecentId).then(list => {
    // reverse the list to get songs oldest to newest
    list.reverse()
    // once we have that list, if there are songs start the download process
    // we can just return an empty list, and run the process as well for simplicity
    return list.reduce((p, song) => p
      .then(() => downloadSongArt(song))
      .then(() => downloadSong(song))
      .then(() => Actions.addSong(song)),
    Promise.resolve())
      .then(() => Downloader.downloaderComplete())
      .catch(err => {
        Downloader.downloaderError({ err })
        Alert.alert('Download Error', err.message, [{ text: 'OK' }])
      })
  })
})

Effect('cancelSync', (payload, getState) => {
  const state = getState()
  console.log(state)
  // if a song is downloading, cancel it
  Downloader.downloaderCancel()
})

export default Downloader
