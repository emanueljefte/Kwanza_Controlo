import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Typo from "./Typo";

export default function WalletListItem({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) {
  const openWallet = () => {
    router.push({pathname: "/(modals)/WalletModal", params: {id: item?.id, name: item?.name, image: item?.image}})
  }
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity
        className="flex-row items-center"
        style={{ marginTop: verticalScale(17) }} onPress={openWallet}
      >
        <View
          style={{
            height: verticalScale(45),
            width: verticalScale(45),
            borderRadius: verticalScale(12),
            borderCurve: "continuous",
          }}
          className="border overflow-hidden border-neutral-600"
        >
          <Image
            className="flex-1"
            source={item?.image}
            contentFit="cover"
            transition={100}
          />
        </View>
          <View className="flex-1 gap-1" style={{ marginLeft: scale(10) }}>
            <Typo size={18}>{item?.name}</Typo>
            <Typo size={14} color={"#ddd"}>
              {item?.amount}
            </Typo>
          </View>
        <FontAwesome
          name="caret-right"
          size={verticalScale(20)}
          color={"#fff"}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
