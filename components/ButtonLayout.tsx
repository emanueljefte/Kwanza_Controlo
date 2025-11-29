import { CustomButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import {
  TouchableOpacity,
  View
} from "react-native";
import Loading from "./Loading";


export default function Button({style, onPress, loading = false, children}: CustomButtonProps) {
  if (loading) {
    return (
      <View className={`bg-transparent justify-center rounded-md`} style={[style, {height: verticalScale(52)}]}>
        <Loading />
      </View>
    )
  }
  return (
    <TouchableOpacity onPress={onPress} style={[style, {height: verticalScale(52)}]} className={`bg-orange-500 justify-center rounded-lg items-center p-3`}>
      {children}
    </TouchableOpacity>
  );
}