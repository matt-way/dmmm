import React, { Component } from 'react'
import { ListView, View, Text } from 'react-native'
import SongTile from 'app/components/SongTile'

const genDummy = n => {
  const output = []
  for(var i=0; i<n; i++){
    output.push({
      name: 'some name' + Math.random(),
      image: 'http://random.cat/view?i=' + Math.floor(Math.random() * 100),
      duration: Math.floor(Math.random() * 200)
    })
  }
  return output
}

class SongList extends Component {
  constructor() {
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(genDummy(20))
    }
  }

  render() {
    const { navigator } = this.props
    return (
      <View style={{flex: 1}}>
        <Text>Yo</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={song => <SongTile song={song} navigator={navigator}/>}
        />
    </View>
    )
  }
}

export default SongList
