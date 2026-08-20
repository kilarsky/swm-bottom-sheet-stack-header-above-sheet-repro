import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import {
  BottomSheet,
  BottomSheetProvider,
} from "@swmansion/react-native-bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const DATA = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

const HOSTS = ["js-stack", "native-stack"] as const;

type Host = (typeof HOSTS)[number];

const JsStack = createStackNavigator();
const NativeStack = createNativeStackNavigator();

const HEADER_OPTIONS = {
  headerStyle: { backgroundColor: "rgba(255, 0, 0, 0.4)" },
} as const;

const keyExtractor = (item: string) => item;

const renderItem = ({ item }: { item: string }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>{item}</Text>
  </View>
);

export default function App() {
  const [index, setIndex] = useState(0);
  const [host, setHost] = useState<Host>("js-stack");

  const openSheet = () => setIndex(1);
  const closeSheet = () => setIndex(0);

  const screen = () => (
    <Screen onOpen={openSheet} host={host} onHostChange={setHost} />
  );

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <BottomSheetProvider>
          <NavigationContainer>
            {host === "js-stack" ? (
              <JsStack.Navigator screenOptions={HEADER_OPTIONS}>
                <JsStack.Screen name="Stack header">{screen}</JsStack.Screen>
              </JsStack.Navigator>
            ) : (
              <NativeStack.Navigator screenOptions={HEADER_OPTIONS}>
                <NativeStack.Screen name="Stack header">
                  {screen}
                </NativeStack.Screen>
              </NativeStack.Navigator>
            )}
          </NavigationContainer>

          <BottomSheet
            index={index}
            onIndexChange={setIndex}
            surface={<View style={styles.surface} />}
          >
            <FlatList
              data={DATA}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListHeaderComponent={
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>List content</Text>
                  <Pressable onPress={closeSheet} style={styles.button}>
                    <Text style={styles.buttonText}>Close</Text>
                  </Pressable>
                </View>
              }
            />
          </BottomSheet>
        </BottomSheetProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

type ScreenProps = {
  onOpen: () => void;
  host: Host;
  onHostChange: (host: Host) => void;
};

function Screen({ onOpen, host, onHostChange }: ScreenProps) {
  const selectHost = (option: Host) => () => onHostChange(option);

  return (
    <View style={styles.screen}>
      <Text style={styles.body}>
        The list is long enough that the content detent reaches the top of the
        window, so the sheet covers the area the stack header occupies.
      </Text>
      <Text style={styles.expected}>
        Expected: the sheet covers the header, the way it covers the screen
        content.
      </Text>

      <View style={styles.hostRow}>
        {HOSTS.map((option) => (
          <Pressable
            key={option}
            onPress={selectHost(option)}
            style={[
              styles.hostOption,
              host === option && styles.hostOptionSelected,
            ]}
          >
            <Text
              style={[
                styles.hostOptionText,
                host === option && styles.hostOptionTextSelected,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onOpen} style={styles.button}>
        <Text style={styles.buttonText}>Open sheet</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  hostRow: {
    flexDirection: "row",
    gap: 8,
  },
  hostOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1f6feb",
  },
  hostOptionSelected: {
    backgroundColor: "#1f6feb",
  },
  hostOptionText: {
    fontSize: 15,
    color: "#1f6feb",
  },
  hostOptionTextSelected: {
    color: "#fff",
  },
  screen: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: "#e9eef5",
  },
  body: {
    fontSize: 15,
    lineHeight: 21,
  },
  expected: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#1f6feb",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  surface: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHeader: {
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d0d7de",
    backgroundColor: "#fff",
  },
  itemText: {
    fontSize: 15,
  },
});
