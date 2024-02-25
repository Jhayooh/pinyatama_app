import React from 'react'
import { Button, View } from 'react-native'

export default function TabView({navigation}) {
  return (
    <Button title='pindutin ako' onPress={()=>navigation.navigate('ProductionInput')}></Button>
  )
}
