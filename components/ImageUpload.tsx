import { getFilePath } from '@/services/imageService'
import { ImageUploadProps } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { FontAwesome } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Typo from './Typo'

export default function ImageUpload({onSelect, onClear, containerStyle, imageStyle, placeholder = "", file = null}: ImageUploadProps) {
    
    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          // allowsEditing: true,
          // aspect: [4, 3],
          quality: 0.5
        })
    
        if (!result.canceled) onSelect(result.assets[0].uri)
      }
    return (
    <View>
      {!file && (
        <TouchableOpacity onPress={onPickImage} style={[containerStyle && containerStyle, {height: verticalScale(54), borderRadius: verticalScale(15)}]} className='bg-neutral-700 flex-row justify-center items-center gap-[10px] border border-neutral-500 border-dashed'>
            <FontAwesome name='upload' color={'#bbb'} />
            {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}

      {file && (
        <View style={[imageStyle && imageStyle, {height: scale(150), width: scale(150), borderRadius: verticalScale(15), borderCurve: 'continuous'}]} className='overflow-hidden'>
<Image className='flex-1' source={getFilePath(file)} contentFit='cover' transition={100} />
            <TouchableOpacity onPress={onClear} className='absolute' style={{top: scale(6), right: scale(6), shadowColor: '#000', shadowOffset: {width: 0, height: 5}, shadowOpacity: 1, shadowRadius: 10}}>
                <FontAwesome name='trash-o' size={verticalScale(24)} color={'#fff'} />
            </TouchableOpacity>
        </View>
      )}
    </View>
  )
}