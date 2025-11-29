import { ModalWrapperProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { Platform, View } from 'react-native'

const isIOS = Platform.OS == "ios"
export default function ModalWrapper({style, children, bg = "#222"}: ModalWrapperProps) {

  return (
    <View className='flex-1' style={[{backgroundColor: bg, paddingTop: isIOS ? verticalScale(15) : 50, paddingBottom: isIOS ? verticalScale(20) : verticalScale(10)}, style && style]}>
      {children}
    </View>
  )
}