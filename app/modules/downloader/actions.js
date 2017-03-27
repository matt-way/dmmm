import RNFS from 'react-native-fs'
import initClient from 'app/graphql_client'
import { CHURN_API_URL, AUDIO_API_URL } from 'app/constants'
import { addSong } from '../songlist/add'

const CHANNEL_SLUG = 'dmmm',
  MAX_SONGS = 50

const DOWNLOADER_STARTED = 'DOWNLOADER_STARTED',
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
const downloadSongsStarted = () => ({
  type: DOWNLOAD_SONGS_STARTED
})
const downloaderComplete = () => ({
  type: DOWNLOADER_COMPLETE
})
const downloadSongStarted = (song, jobId) => ({
  type: DOWNLOAD_SONG_STARTED
})
const downloadSongProgress = details => ({
  type: DOWNLOAD_SONG_PROGRESS
})

const downloadSongComplete = details => ({
  type: DOWNLOAD_SONG_COMPLETE
})
const downloadSongCancel = details => ({
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
    const { channel_id, youtube_id, channel_position } = cursor
    return gqlClient.query(`
      query {
        channel(slug: ${CHANNEL_SLUG}){
          videos(first: ${first}, cursor: {
            channel_id: ${channel_id}
            youtube_id: ${youtube_id}
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
        channel(slug: ${CHANNEL_SLUG}){
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
  const videos = data.channel.videos.edges
  const currentIndex = videos.findIndex(i => i.youtube_id === mostRecentId)
  if(videos.length <= 0){
    return list
  }else if(currentIndex >= 0){
    return list.concat(videos.slice(0, currentIndex))
  }else if(list.length + videos.length >= MAX_SONGS){
    return list.concat(videos)
  }else{
    return songListQuery(30, videos[videos.length - 1])
      .then(({ data }) => buildList(id, data, list.concat(videos)))
  }
}

const getListToAdd = mostRecentId => {
  return songListQuery(30).then(({ data }) => buildList(mostRecentId, data, []))
}

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
}

const startSync = mostRecentId => dispatch => {
  dispatch(downloaderStarted())
  /*
  // using the most recent id in the song list figure out if songs
  // need to be downloaded by querying the api and figuring out the difference
  return getListToAdd(mostRecentId).then(list => {
    // once we have that list, if there are songs start the download process
    // we can just return an empty list, and run the process as well for simplicity
    dispatch(downloadSongsStarted())
    list.reduce((p, song) => p.then(() => {
      const result = downloadSong(song, dispatch)
      return result.promise.then(() => {
        addSong(song)(dispatch)
        dispatch(downloadSongComplete())
      })
    }, Promise.resolve())).then(() => dispatch(downloaderComplete()))
  })
  .catch(err => {
    dispatch(downloaderError(err))
  })*/

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
  [DOWNLOAD_SONGS_STARTED]: state => {

  },
  [DOWNLOADER_COMPLETE]: state => ({
    running: false
  }),
  [DOWNLOAD_SONG_STARTED]: state => {

  },
  [DOWNLOAD_SONG_PROGRESS]: state => {

  },
  [DOWNLOAD_SONG_COMPLETE]: state => {

  },
  [DOWNLOAD_SONG_CANCEL]: state => {

  },
  [DOWNLOAD_SONG_ERROR]: state => {

  }
}

export {
  startSync,
  cancelSync,
  handlers
}
