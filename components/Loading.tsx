import React from 'react'
import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native'

export default function Loading({size = "large", color = "white"}: ActivityIndicatorProps) {
  return (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}