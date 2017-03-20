import React from 'react'

class SongDownloader extends Component {

  onProgress(data) {
    setState(data)
  }

  onProgress(details) {
    // update the internal state just for progress events

  }

  componentDidMount() {
    // start the downloading process
    startDownloading(this.onProgress)


    // start the downloading process
    downloader.start(onProgress, onSongCompleted)
      .then(() => this.props.finished())
      .catch(err =>

    // pass in callbacks for song progress or just for an update
  }

  render() {
    return (
      <View>
        <Text>Some top downloader text</Text>
      </View>
    )
  }
}

export default connect()
