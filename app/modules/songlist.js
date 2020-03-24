import { State, Effect } from 'jumpstate'
import { AsyncStorage } from 'react-native'
import { STORAGE_KEY } from 'app/constants'

const SongList = State('songlist', {
  initial: {
    list: [],
    listloading: false,
    loadingError: null,
    songAdding: false,
    addingError: null
  },
  listLoading: (state, payload) => {
    return {
      listLoading: true
    }
  },
  listLoaded: (state, { list }) => {
    return {
      list,
      listLoading: false
    }
  },
  listLoadingError: (state, { err }) => {
    return {
      loadingError: err,
      listLoading: false
    }
  },
  songAdding: (state, payload) => {
    return {
      ...state,
      songAdding: true
    }
  },
  songAdded: (state, { song }) => {
    return {
      ...state,
      list: [song, ...state.list]
    }
  },
  songAddingError: (state, { err }) => {
    return {
      ...state,
      addingError: err
    }
  }
})

Effect('loadList', (options = {}) => {
  SongList.listLoading()
  return AsyncStorage.getItem(STORAGE_KEY)
    .then(JSON.parse)
    /*.then(() => [
      {
        name: 'First One',
        //image: `http://www.phoca.cz/demo/images/phocagallery/shadowbox/thumbs/phoca_thumb_l_alps-${(i%5)+1}.jpg`,
        image: 'http://img.youtube.com/vi/CgYTK2fxHw8/maxresdefault.jpg',
        duration: Math.floor(Math.random() * 200)
      },
      {
        name: 'Secondsy',
        //image: `http://www.phoca.cz/demo/images/phocagallery/shadowbox/thumbs/phoca_thumb_l_alps-${(i%5)+1}.jpg`,
        image: 'http://img.youtube.com/vi/CgYTK2fxHw8/maxresdefault.jpg',
        duration: Math.floor(Math.random() * 200)
      }
    ])*/
    .then(list => SongList.listLoaded({ list: list || [] }))
    .catch(err => SongList.listLoadingError({ err }))
})

Effect('addSong', song => {
  SongList.songAdding()
  return AsyncStorage.getItem(STORAGE_KEY)
    .then(JSON.parse)
    .then(list => {
      if(!list) { list = [] }
      list.unshift(song)
      return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    })
    .then(() => SongList.songAdded({ song }))
    .catch(err => {
      SongList.songAddingError({ err })
      // re-reject the error so that parents can deal with it as well
      return Promise.reject(err)
    })
})

export default SongList
