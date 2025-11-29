import { expenseCategories } from '@/constants/data'
import { TransactionItemProps, TransactionListType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from './Loading'
import Typo from './Typo'

export default function TransitionList({data, title, loading, emptyListMessage}: TransactionListType) {
    const handleClick = () => {

    }
  return (
    <View style={styles.container}>
      {
        title && (
            <Typo size={20} fontWeight={'500'}>{title}</Typo>
        )
      }
      <View style={styles.list}>
        {/* Install FhashList */}
        <FlatList data={data} renderItem={({item, index}) => <TransactionItem item={item} index={index} handleClick={handleClick} />} />

      </View>
      {
        !loading && data.length == 0 && (
            <Typo size={15} color='#999' style={{textAlign: 'center', marginTop: verticalScale(15)}}>{emptyListMessage}</Typo>
        )
      }

      {
        loading && (
            <View style={{top: verticalScale(100)}}>
                <Loading />
            </View>
        )
      }
    </View>
  )
}

export const TransactionItem = ({item, index, handleClick}: TransactionItemProps) => {
    let category = expenseCategories['rent']
    const IconComponent = category.icon
    return <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(6)}>
        <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
            <View style={[styles.icon, {backgroundColor: category.bgColor}]}>
                {IconComponent && (
                    <FontAwesome name={IconComponent} size={verticalScale(25)} color={'#fff'}/>
                )}
            </View>
            <View style={styles.categoryDes}>
                <Typo size={16}>{category.label}</Typo>
                <Typo size={12} color='#aaa' textProps={{numberOfLines: 1}}>{item?.description || "Paid"}</Typo>
            </View>
            <View style={styles.amountDate}>
                <Typo fontWeight={'500'} color='#f00'>- 123 KZ</Typo>
                <Typo size={12} color='#aaa'>12 jan</Typo>
            </View>
        </TouchableOpacity>
    </Animated.View>
}


const styles = StyleSheet.create({
    container: {
        gap: verticalScale(17)
    },
    list: {
        minHeight: 3
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: scale(12),
        marginBottom: verticalScale(12),

        backgroundColor: '#222',
        padding: verticalScale(10),
        paddingHorizontal: verticalScale(10),
        borderRadius: verticalScale(17)
    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: verticalScale(12),
        borderCurve: 'continuous'
    },
    categoryDes: {
        flex: 1,
        gap: 2.5
    },
    amountDate: {
        alignItems: 'flex-end',
        gap: 3
    }
})