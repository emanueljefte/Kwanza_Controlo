import { ScreenWrapperProps } from '@/types'
import React from 'react'
import { Dimensions, Platform, StatusBar, View } from 'react-native'

const {height} = Dimensions.get("window")

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => {
   let paddingTop = Platform.OS == "ios" ? height * 0.06 : 30;
    return (
    <View className={`pt-[${paddingTop}] flex-1 bg-neutral-900`} style={[style, {paddingTop}]}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#171717'} />
      {children}
    </View>
  )
}

export default ScreenWrapper