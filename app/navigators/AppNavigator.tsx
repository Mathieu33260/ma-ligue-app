/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import Config from "../config"
import { useStores } from "../models"
import {
  WelcomeScreen,
} from "../screens"
import {
  OnboardingLeagueScreen, OnboardingLoginScreen,
  OnboardingTeamScreen,
} from "../screens/OnboardingScreen"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import {HomeScreen} from '../screens/HomeScreen';

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Home: undefined,
}

export type OnboardingStackParamList = {
  OnboardingLeague: undefined,
  OnboardingTeam: { league: number },
  OnboardingLogin: { team: string },
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = StackScreenProps<
  AppStackParamList,
  T
>

export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> = StackScreenProps<
    OnboardingStackParamList,
    T
    >

const AppStack = createNativeStackNavigator<AppStackParamList>()
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>()

const RootStack = observer(function RootStack() {

  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  return (
      isAuthenticated ? (
          <AppStack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={"Home"}
          >
            <>
              <AppStack.Screen name="Home" component={HomeScreen} />
            </>
          </AppStack.Navigator>
          ) : (
          <OnboardingStack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={"OnboardingLeague"}
          >
            <>
              <OnboardingStack.Screen name="OnboardingLeague" component={OnboardingLeagueScreen} />
              <OnboardingStack.Screen name="OnboardingTeam" component={OnboardingTeamScreen} />
              <OnboardingStack.Screen name="OnboardingLogin" component={OnboardingLoginScreen} />
            </>
          </OnboardingStack.Navigator>
      )
  )
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <RootStack />
    </NavigationContainer>
  )
})
