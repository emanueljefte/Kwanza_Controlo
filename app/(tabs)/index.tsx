import Button from '@/components/ButtonLayout'
import HomeCard from '@/components/HomeCard'
import ScreenWrapper from '@/components/ScreenWrapper'
import TransitionList from '@/components/TransitionList'
import Typo from '@/components/Typo'
import { useAuth } from '@/contexts/AuthProvider'
import { scale, verticalScale } from '@/utils/styling'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

export default function Home() {
  const {user} = useAuth()
  return (
    <ScreenWrapper>

      <View className='flex-1' style={{paddingHorizontal: scale(20), marginTop: verticalScale(8)}}>
        <View className='flex-row justify-between items-center' style={{marginBottom: verticalScale(10)}}>
          <View className='gap-1'>
            <Typo size={20} color='#ddd'>Olá,</Typo>
            <Typo size={30} fontWeight={"500"}>{user?.name}</Typo>
          </View>
          <TouchableOpacity className='bg-neutral-700 rounded-[50px]' style={{padding: scale(10)}}>
            <FontAwesome name='search' size={verticalScale(22)} color={'#ccc'} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerClassName='' showsVerticalScrollIndicator={false}>
          <View>
            <HomeCard />
          </View>
          <TransitionList data={[1, 2, 4, 6, 7, 8]} title='Transações recentes' loading={false} emptyListMessage='Sem transações efectuadas' />
        </ScrollView>
        <Button style={{height: verticalScale(50), width: verticalScale(50), borderRadius: 100, position: 'absolute', bottom: verticalScale(30), right: verticalScale(30)}} onPress={() => router.push('/(modals)/transactionModel')}>
          <FontAwesome name='plus' color={'#000'} size={verticalScale(24)} />
        </Button>
      </View>
    
    </ScreenWrapper>
  )
}