import { BackButtonProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'

export default function BackButton({style, iconSize = 20 }: BackButtonProps) {
    const router = useRouter()
    return (
    <TouchableOpacity onPress={() => router.back()} className={`bg-neutral-600 self-start p-3`} style={[style, {borderRadius: verticalScale(12), borderCurve: "continuous"}]}>
      <AntDesign name='caret-left' size={verticalScale(iconSize)} color={"white"} />
    </TouchableOpacity>
  )
}