import CustomTabs from "@/components/CustomTabs";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Tabs } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <ScreenWrapper>
      <Tabs
        tabBar={(props) => <CustomTabs {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="statistics" />
        <Tabs.Screen name="wallet" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </ScreenWrapper>
  );
}
