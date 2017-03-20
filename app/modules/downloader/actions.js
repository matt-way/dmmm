import RNFS from 'react-native-fs'
import initClient from 'graphql-client'
import { CHURN_API_URL } from 'app/constants'

const CHANNEL_SLUG = 'dmmm'
const MAX_SONGS = 50

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
      .then(({ data }) => buildList(id, data, list.concat(videos))
  }
}

const getListToAdd = mostRecentId => {
  return songListQuery(30).then(({ data }) => buildList(mostRecentId, data, [])
}

const startSync = mostRecentId => dispatch => {
  dispatch(syncStarted())
  // using the most recent id in the song list figure out if songs
  // need to be downloaded by querying the api and figuring out the difference
  return getListToAdd(mostRecentId).then(list => {
    // once we have that list, if there are songs start the download process
    // we can just return an empty list, and run the process as well for simplicity

    // go through each track in the correct order and being the download
    // setting a current should do
    // we could do update progress events as well (shouldn't matter)
    // each song download should have an event that sets up the details for the song
    // then updates for getting the image and then progress
    // if a song fails for whatever reason, we should just fail the entire process
    // once a song completes successfully we should call the add action to add it to the action list

    // once all songs have been downloaded call a complete update, which will clear the rendering of the control

  })
  .catch(err => {
    dispatch(downloaderError(err))
  })
}

const cancelSync = () => {
  // this simply sets cancel to true
  // and cancels the downloader id which should also be in the state
  // unless it is kept locally here in this file
  // keeping it on the state shouldn't hurt, and keeps everything together

}

export {
  startSync,
  cancelSync
}
