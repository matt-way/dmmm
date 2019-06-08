import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import { THEME } from '../constants'
import { actions as menuActions } from '../state/menu'
import {
  playPause,
  nextSong,
  previousSong,
  toggleShuffle
} from '../state/player'
import { durationToString } from '../utils/time'
import Condtional from './conditional'
import { actions as listActions } from '../state/songlist'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 15,
    backgroundColor: THEME.light,
    //width: 240,
    height: 50,
    borderRadius: 3,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 5
  },
  logoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 5,
    backgroundColor: THEME.light
  },
  logo: {
    width: 40,
    height: 40
  },
  controlButtons: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start',
    left: 0,
    bottom: 6,
    height: 40,
    width: 200
  },
  icons: {
    padding: 6
  },
  currentSong: {
    flexDirection: 'row',
    width: 230,
    borderBottomColor: 'rgba(0,0,0,0.03)',
    borderBottomWidth: 1,
    paddingBottom: 4
  },
  songArt: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: THEME.light,
    borderRadius: 5,
    marginLeft: 0
  },
  titleContainer: {
    paddingLeft: 5,
    marginRight: 5
  },
  titleText: {
    fontSize: 12,
    marginTop: 2,
    marginRight: 35
  },
  durationText: {
    fontSize: 12
  }
})

class Controls extends React.Component {
  state = {
    sizeAnim: new Animated.ValueXY({ x: 50, y: 50 })
  }

  render() {
    const {
      downloading,
      currentSong,
      currentTime,
      playing,
      shuffle,
      playPause,
      nextSong,
      previousSong,
      toggleShuffle,
      menuOpen,
      openMenu,
      closeMenu,
      scrollTo
    } = this.props
    const { sizeAnim } = this.state

    var height = currentSong ? sizeAnim.y : 50
    if (menuOpen && currentSong) {
      height = 100
    }

    return (
      <Animated.View
        style={[
          styles.container,
          {
            bottom: downloading ? 90 : 15,
            width: sizeAnim.x,
            height: height
          }
        ]}
      >
        <Condtional if={menuOpen}>
          {currentSong && (
            <TouchableOpacity onPress={() => scrollTo(currentSong)}>
              <View style={styles.currentSong}>
                <Image
                  style={styles.songArt}
                  source={{
                    uri: `https://img.youtube.com/vi/${
                      currentSong.youtube_id
                    }/hqdefault.jpg`
                  }}
                />
                <View style={styles.titleContainer}>
                  <Text
                    style={styles.titleText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {currentSong.title}
                  </Text>
                  <Text style={styles.durationText}>
                    {`${durationToString(currentTime)}/${durationToString(
                      currentSong.duration
                    )}`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={styles.icons}
              onPress={() => previousSong()}
            >
              <Icon name="skip-back" size={30} color={THEME.dark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icons} onPress={() => playPause()}>
              {playing ? (
                <Icon name="pause" size={30} color={THEME.dark} />
              ) : (
                <Icon name="play" size={30} color={THEME.dark} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.icons} onPress={() => nextSong()}>
              <Icon name="skip-forward" size={30} color={THEME.dark} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icons}
              onPress={() => toggleShuffle()}
            >
              <Icon
                name="shuffle"
                size={30}
                color={shuffle ? THEME.selected : THEME.dark}
              />
            </TouchableOpacity>
          </View>
        </Condtional>
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => {
            if (menuOpen) {
              closeMenu()
              if (menuOpen && currentSong) {
                this.state.sizeAnim.y.setValue(100)
              }
              Animated.timing(this.state.sizeAnim, {
                toValue: { x: 50, y: 50 },
                duration: 300
              }).start()
            } else {
              Animated.timing(this.state.sizeAnim, {
                toValue: { x: 240, y: currentSong ? 100 : 50 },
                duration: 200
              }).start(() => {
                openMenu()
              })
            }
          }}
        >
          <Image
            style={styles.logo}
            source={require('../../assets/icon.png')}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const enhance = connect(
  ({ player, menu, downloader }) => ({
    playing: player.playing,
    shuffle: player.shuffle,
    menuOpen: menu.open,
    downloading: downloader.running,
    currentSong: player.song,
    currentTime: player.currentTime
  }),
  {
    playPause,
    nextSong,
    previousSong,
    toggleShuffle,
    openMenu: menuActions.open,
    closeMenu: menuActions.close,
    scrollTo: listActions.scrollTo
  }
)

export default enhance(Controls)
