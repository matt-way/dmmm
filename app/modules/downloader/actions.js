import RNFetchBlob from 'react-native-fetch-blob'
import initClient from 'app/graphql_client'
import { CHURN_API_URL, AUDIO_API_URL } from 'app/constants'
import { addSong } from '../songlist/add'

const CHANNEL_SLUG = 'dmmm',
  MAX_SONGS = 50

const DOWNLOADER_STARTED = 'DOWNLOADER_STARTED',
  DOWNLOADER_ERROR = 'DOWNLOADER_ERROR',
  DOWNLOAD_SONGS_STARTED = 'DOWNLOAD_SONGS_STARTED',
  DOWNLOADER_COMPLETE = 'DOWNLOADER_COMPLETE',
  DOWNLOAD_SONG_STARTED = 'DOWNLOAD_SONG_STARTED',
  DOWNLOAD_SONG_PROGRESS = 'DOWNLOAD_SONG_PROGRESS',
  DOWNLOAD_SONG_COMPLETE = 'DOWNLOAD_SONG_COMPLETE',
  DOWNLOAD_SONG_CANCEL = 'DOWNLOAD_SONG_CANCEL',
  DOWNLOAD_SONG_ERROR = 'DOWNLOAD_SONG_ERROR'

const downloaderStarted = () => ({
  type: DOWNLOADER_STARTED
})
const downloaderError = () => ({
  type: DOWNLOADER_ERROR
})
const downloadSongsStarted = () => ({
  type: DOWNLOAD_SONGS_STARTED
})
const downloaderComplete = () => ({
  type: DOWNLOADER_COMPLETE
})
const downloadSongStarted = (song, jobId) => ({
  song,
  jobId,
  type: DOWNLOAD_SONG_STARTED
})
const downloadSongProgress = progressDetails => ({
  progressDetails,
  type: DOWNLOAD_SONG_PROGRESS
})
const downloadSongComplete = () => ({
  type: DOWNLOAD_SONG_COMPLETE
})
const downloadSongCancel = () => ({
  type: DOWNLOAD_SONG_CANCEL
})
const downloadSongError = details => ({
  type: DOWNLOAD_SONG_ERROR
})

const gqlClient = initClient({
  url: CHURN_API_URL
})

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

const getListToAdd = mostRecentId => {
  return songlistQuery(30).then(({ data }) => buildList(mostRecentId, data, []))
}

const dirs = RNFetchBlob.fs.dirs
const downloadSong = (song, dispatch) => {
  console.log(song)
  return RNFetchBlob
    .config({
      path : `${dirs.DocumentDir}/${song.youtube_id}`
    })
    .fetch('GET', `${AUDIO_API_URL}${song.youtube_id}`)
    .progress({ count : 25 }, (received, total) => {
      console.log('progress', received / total)
      dispatch(downloadSongProgress({
        received, total
      }))
    })
}


/*
const downloadSong = (song, dispatch) => {
  return RNFS.downloadFile({
    fromUrl: `${AUDIO_API_URL}${song.youtube_id}`,
    toFile: `${RNFS.DocumentDirectoryPath}/${song.youtube_id}`,
    background: true,
    backgroundDivider: 25,
    begin: details => {
      // does the job id get given here?
      dispatch(downloadSongStarted(song))
    },
    progress: details => {
      dispatch(downloadSongProgress(details))
    }
  })
}*/

const startSync = mostRecentId => dispatch => {
  dispatch(downloaderStarted())
  // using the most recent id in the song list figure out if songs
  // need to be downloaded by querying the api and figuring out the difference
  return getListToAdd(mostRecentId).then(list => {
    // once we have that list, if there are songs start the download process
    // we can just return an empty list, and run the process as well for simplicity
    dispatch(downloadSongsStarted())

    return list.reduce((p, song) => p.then(() => {
      const task = downloadSong(song, dispatch)
      dispatch(downloadSongStarted(song, task))
      return task.then(() => {
        dispatch(downloadSongComplete)
        return addSong(song)(dispatch)
      })
    }), Promise.resolve())
    .then(() => dispatch(downloaderComplete()))
  })
  .catch(err => {
    dispatch(downloaderError(err))
  })

  setTimeout(() => dispatch(downloaderComplete()), 2000)
}

const cancelSync = () => dispatch => {
  dispatch(cancelDownload())
}

// reducer handlers
const handlers = {
  [DOWNLOADER_STARTED]: state => ({
    running: true
  }),
  [DOWNLOAD_SONGS_STARTED]: state => ({
    ...state,
    downloadingSongs: true
  }),
  [DOWNLOADER_COMPLETE]: state => ({
    running: false
  }),
  [DOWNLOAD_SONG_STARTED]: (state, { song, jobId }) => ({
    ...state,
    song,
    jobId
  }),
  [DOWNLOAD_SONG_PROGRESS]: (state, { progressDetails }) => ({
    ...state,
    progressDetails
  }),
  [DOWNLOAD_SONG_COMPLETE]: state => ({
    ...state
  }),
  [DOWNLOAD_SONG_CANCEL]: state => ({
    ...state
  }),
  [DOWNLOAD_SONG_ERROR]: state => ({
    ...state
  })
}

export {
  startSync,
  cancelSync,
  handlers
}
