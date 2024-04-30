import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppColors from "./constants/AppColors";
import { StyleSheet, Platform } from "react-native";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import Habits from "./screens/Habits";
import Insights from "./screens/Insights";
import Profile from "./screens/Profile";
import AddHabit from "./screens/AddHabit";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { setupDbTablesForce } from "./util/dbUtil";
import { SQLiteProvider } from "./components/hookProviders/SQLiteProvider";
import HomeYesterDay from "./screens/HomeYesterday";
import HabitInsightsCalander from "./screens/HabitInsightsCalander";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: AppColors.dark_panel,
          width: 240,
        },
        headerStyle: {
          backgroundColor: AppColors.dark_background,
        },
        headerShadowVisible: false,
        drawerInactiveTintColor: "white",
        drawerActiveTintColor: "white",
        headerTintColor: "white",
        drawerContentContainerStyle: styles.listItem,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: "",
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="Habits"
        component={Habits}
        options={{
          title: "",
          drawerLabel: "Habits",
        }}
      />
      <Drawer.Screen
        name="Insights"
        component={Insights}
        options={{
          title: "",
          drawerLabel: "Insights",
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "",
          drawerLabel: "Profile",
        }}
      />
    </Drawer.Navigator>
  );
}

SplashScreen.preventAutoHideAsync();

setupDbTablesForce();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
registerForPushNotificationsAsync();

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "ef2f6b0f-66ab-4614-bae7-cd193faa844a",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    regular: require("./assets/fonts/Titillium_Web/TitilliumWeb-Regular.ttf"),
    bold: require("./assets/fonts/Titillium_Web/TitilliumWeb-Bold.ttf"),
    regularItalic: require("./assets/fonts/Titillium_Web/TitilliumWeb-Italic.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />

      <SQLiteProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: AppColors.dark_background,
              },
              headerBackVisible: false,
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name="Drawer"
              component={DrawerNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddHabit"
              component={AddHabit}
              options={{
                title: "",
              }}
            />
            <Stack.Screen
              name="HomeYesterday"
              component={HomeYesterDay}
              options={{
                title: "",
                animation: "slide_from_left",
              }}
            />
            <Stack.Screen
              name="HabitInsightsCalander"
              component={HabitInsightsCalander}
              options={{
                title: "",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SQLiteProvider>
    </>
  );
}

const styles = StyleSheet.create({
  listItem: { marginTop: "100%" },
});
