import { InputProps } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import React from 'react'
import { TextInput, View } from 'react-native'

export default function Input(props: InputProps) {
  return (
    
    <View className={`flex-row items-center justify-center border border-neutral-300`} style={{height: verticalScale(54), borderRadius: verticalScale(17), paddingHorizontal: scale(15), gap: scale(10)}}>
      {props.icon && props.icon}
      <TextInput className={`flex-1 text-white`} style={{fontSize: verticalScale(14)}} placeholderTextColor={"#ccc"} ref={props.inputRef && props.inputRef} {...props}/>
    </View>
  )
}