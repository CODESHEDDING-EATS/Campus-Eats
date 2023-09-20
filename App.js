import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator} from "@react-navigation/stack";
import 'react-native-gesture-handler';
import React, { createContext, useState} from "react";
import BottomNavigator from "../Campus-Eats/BottomNavigator";
import SignUpScreen from "./Screens/SignUp";
import SplashScreen from "./Screens/Splash";

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
              <Stack.Screen name="Home" component={BottomNavigator}/>
              <Stack.Screen name="SignUp" component={BottomNavigator}/>
              <Stack.Screen name="Login" component={BottomNavigator}/>
              <Stack.Screen name="Restuarnats" component={BottomNavigator}/>
          </Stack.Navigator>
        </NavigationContainer>
      </MyContext.Provider>
  );
}
