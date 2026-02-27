import { Colors } from "@/constants/colors";
import { getFilePath } from "@/services/imageService";
import { ImageUploadProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

export default function ImageUpload({
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
  file = null,
}: ImageUploadProps) {
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
    });

    if (!result.canceled) {
      onSelect(result.assets[0].uri);
    }
  };
  // 1. Defina a fonte primeiro
  const filePath = getFilePath(file);

  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={onPickImage}
          style={[
            {
              height: verticalScale(54),
              borderRadius: verticalScale(15),
              backgroundColor: Colors.primary + "15",
            }, // Fundo suave para o botão
            containerStyle,
          ]}
          className="flex-row justify-center items-center gap-[10px] border border-primary border-dashed"
        >
          <FontAwesome name="camera" size={18} color={Colors.primary} />
          {placeholder && (
            <Typo color={Colors.primary} size={15} fontWeight="600">
              {placeholder}
            </Typo>
          )}
        </TouchableOpacity>
      )}

      {file && (
        <View
          style={[
            {
              height: scale(150),
              width: scale(150),
              borderRadius: verticalScale(15),
              borderCurve: "continuous",
              backgroundColor: "#222",
            },
            imageStyle,
          ]}
          className="overflow-hidden border border-neutral-700"
        >
          <Image
            key={typeof file === "string" ? file : "default"}
            style={{ width: "100%", height: "100%" }}
            source={filePath}
            contentFit="cover"
            transition={200}
          />

          <TouchableOpacity
            onPress={onClear}
            className="absolute"
            style={{
              top: scale(8),
              right: scale(8),
              backgroundColor: "rgba(0,0,0,0.6)", // Fundo escuro para destacar o ícone
              padding: 6,
              borderRadius: 10,
            }}
          >
            <FontAwesome
              name="trash"
              size={verticalScale(18)}
              color="#ff4444"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
