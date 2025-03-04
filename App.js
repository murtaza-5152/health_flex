import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Home } from './src/screen/Home';
import { History } from './src/screen/History';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
        <Stack.Navigator
      screenOptions={{headerShown: false}} >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="History" component={History} />
    </Stack.Navigator>
   </NavigationContainer>
  )
};

export default App;
