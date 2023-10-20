import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { registerRootComponent } from 'expo';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator} from "@react-navigation/stack";
import 'react-native-gesture-handler';
import React, { createContext, useState} from "react";
import BottomNavigator from "../Campus-Eats/BottomNavigator";
import SignUpScreen from "./Screens/SignUp";
import SplashScreen from "./Screens/Splash";
import MenuScreen from "./Screens/Menu";
import LoginScreen from "./Screens/Login";
import RestaurantsScreen from "./Screens/Restaurants";
import CartScreen from "./Screens/Cart";
import NotificationsScreen from "./Screens/Notifications";
import FoodScreen from "./Screens/Foods";
import FoodsScreen from "./Screens/Foods";
import MapScreen from "./Screens/Map";

const Stack = createStackNavigator();

export const MyContext = createContext();
export default function App() {
  const [myState, setMyState] = useState('');

  return (
      <MyContext.Provider value={{ myState, setMyState }}>
        <NavigationContainer>
          <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <Stack.Navigator screenOptions={{headerShown: false}} initalRouteName={"SignUp"} testID="stack-navigator">
              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Foods" component={FoodsScreen}/>
              <Stack.Screen name="Home" component={BottomNavigator}/>
              <Stack.Screen name="SignUp" component={BottomNavigator}/>
              <Stack.Screen name="Login" component={BottomNavigator}/>
              <Stack.Screen name="Restuarants" component={BottomNavigator}/>
              <Stack.Screen name="Menu" component={MenuScreen}/>
              <Stack.Screen name="Cart" component={CartScreen}/>
              <Stack.Screen name="Notifications" component={NotificationsScreen}/>
              <Stack.Screen name="Map" component={MapScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </MyContext.Provider>
  );
}
