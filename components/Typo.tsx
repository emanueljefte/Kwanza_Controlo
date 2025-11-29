import { TypoProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { Text, TextStyle } from 'react-native'

export default function Typo({size, fontWeight = "400", color = "white", children, style, textProps}: TypoProps) {
    const textStyle: TextStyle = {
        fontSize: size? verticalScale(size) : verticalScale(18),
        color,
        fontWeight,
    }
    return (
    
      <Text style={[textStyle, style]} {...textProps}>{children}</Text>
    
  )
}