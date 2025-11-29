import { HeaderProps } from '@/types'
import React from 'react'
import { View } from 'react-native'
import Typo from './Typo'

export default function Header({title = "", leftIcon, style} : HeaderProps) {
  return (
    <View className='w-full items-center flex-row'>
      {leftIcon && <View className='self-start'>{leftIcon}</View>}
      {
        title && (
            <Typo size={22} fontWeight={"600"} style={{textAlign: "center", width: leftIcon? "82%": "100%"}}>{title}</Typo>
        )
      }
    </View>
  )
}