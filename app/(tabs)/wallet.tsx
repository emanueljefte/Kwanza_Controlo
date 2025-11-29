import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import WalletListItem from '@/components/WalletListItem'
import { useAuth } from '@/contexts/AuthProvider'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { FontAwesome } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

export default function Wallet() {
  const {user} = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1)
}, [])
)

  const {data: wallets, error, loading} = useFetchData<WalletType>("wallets", {uid: user?.uid as string, orderBy: "created", sort: "desc"}, refreshKey)

  console.log("wallets: ", wallets);
  
  
  const getTotalBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0)
      return total 
    }, 0)
  
  return (
    <ScreenWrapper style={{backgroundColor: 'black'}}>
      <View className='flex-1 justify-between'>

        <View className='items-center justify-center bg-black' style={{height: verticalScale(160)}}>
          <View className='items-center'>
            <Typo size={45} fontWeight={"500"}>
              {getTotalBalance().toFixed(2)} KZ
            </Typo>
            <Typo size={16} color='#ddd'>
              Saldo Total
            </Typo>
          </View>
        </View>

        <View className='flex-1 bg-neutral-900' style={{borderTopRightRadius: verticalScale(30), borderTopLeftRadius: verticalScale(30), padding: scale(20), paddingTop: scale(25)}}>
          <View className='flex-row justify-between items-center' style={{marginBottom: verticalScale(10)}}>
            <Typo size={20} fontWeight={"500"}>Meus Cartões</Typo>
            <TouchableOpacity onPress={() => router.push("/(modals)/WalletModal")}>
              <FontAwesome name='plus-circle' color={'#f97316'} size={verticalScale(33)} />
            </TouchableOpacity>
          </View>
          {loading && <Loading />}
          <FlatList data={wallets} renderItem={({item, index}) => {return <WalletListItem item={item} index={index} router={router} />}} contentContainerStyle={{paddingHorizontal: verticalScale(25), paddingTop: verticalScale(15)}} />
        </View>
      </View>
    </ScreenWrapper>
  )
}