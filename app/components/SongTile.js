import React, { Component } from 'react'
import { Text, TouchableHighlight } from 'react-native'

const SongTile = ({ song, navigator }) => (
  <TouchableHighlight onPress={() => navigator.push({ id: 'player' })}>
    <Text>{song.name}</Text>
  </TouchableHighlight>
)

export default SongTile
