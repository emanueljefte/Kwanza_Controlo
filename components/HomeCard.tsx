import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Typo from "./Typo";

export default function HomeCard() {
  return (
    <ImageBackground
      source={require("@/assets/images/logo.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View style={styles.totalBalanceRow}>
          <Typo color="#222" size={17} fontWeight={"500"}>
            Balanço Total
          </Typo>

          <MaterialCommunityIcons
            name="dots-horizontal"
            size={verticalScale(33)}
            color={"#000"}
          />
        </View>
        <Typo color="#000" size={40} fontWeight={"bold"}>
          12098 KZ
        </Typo>
        <View style={styles.stats}>
            {/* ENTRADA */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <FontAwesome
                  name="arrow-down"
                  size={verticalScale(15)}
                  color={"#000"}
                />
              </View>
              <Typo size={16} color="#222" fontWeight={"500"}>
                Entrada
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color="#0f0" fontWeight={"600"}>
                2334 KZ
              </Typo>
            </View>
          </View>
{/* SAIDA */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <FontAwesome
                  name="arrow-up"
                  size={verticalScale(15)}
                  color={"#000"}
                />
              </View>
              <Typo size={16} color="#222" fontWeight={"500"}>
                Saída
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color="#f00" fontWeight={"600"}>
                2334 KZ
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: scale(20),
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(5),
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: "#ccc",
    padding: verticalScale(5),
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(7),
  },
});
