import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import HabitosScreen from '../screens/HabitosScreen';
import SonoScreen from '../screens/SonoScreen';
import DiarioScreen from '../screens/DiarioScreen';
import VicioScreen from '../screens/VicioScreen';

import CustomNavBar from '../components/CustomNavBar'; // Ajuste o caminho

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomNavBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Vicios" component={VicioScreen} />
      <Tab.Screen name="Hábitos" component={HabitosScreen} />
      <Tab.Screen name="Sono" component={SonoScreen} />
      <Tab.Screen name="Diário" component={DiarioScreen} />
    </Tab.Navigator>
  );
}
