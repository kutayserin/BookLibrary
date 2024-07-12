import { Tabs } from "expo-router";
import React from "react";

import { CustomIcon } from "@/components/icon/CustomIcon";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        tabBarActiveBackgroundColor: Colors["dark"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <CustomIcon
              name={focused ? "search" : "search-outline"}
              color={color}
            />
          ),
          headerShown: true,
          headerTitle: "Library",
          headerBackgroundContainerStyle: {
            backgroundColor: Colors["dark"].background,
          },
        }}
        
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <CustomIcon
              name={focused ? "star" : "star-outline"}
              color={color}
            />
          ),
          headerShown: true,
          headerTitle: "Favorites",
          headerBackgroundContainerStyle: {
            backgroundColor: Colors["light"].background,
          },
        }}
      />
    </Tabs>
  );
}
