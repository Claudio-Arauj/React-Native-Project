import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import HabitosScreen from '../screens/HabitosScreen';
import SonoScreen from '../screens/SonoScreen';
import DiarioScreen from '../screens/DiarioScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <FontAwesome5 name="heartbeat" size={size} color={color} />;
            case 'Hábitos':
              return <MaterialIcons name="check-circle" size={size} color={color} />;
            case 'Sono':
              return <Ionicons name="moon" size={size} color={color} />;
            case 'Diário':
              return <FontAwesome5 name="book-open" size={size} color={color} />;
            case 'Perfil':
              return <FontAwesome5 name="user" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Hábitos" component={HabitosScreen} />
      <Tab.Screen name="Sono" component={SonoScreen} />
      <Tab.Screen name="Diário" component={DiarioScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
