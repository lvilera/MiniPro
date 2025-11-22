import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
import AlbumScreen from '../screens/AlbumScreen';
import PackOpeningScreen from '../screens/PackOpeningScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0e27',
          },
          headerTintColor: '#00ffcc',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: '⚾ Sports Card Collection',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Album"
          component={AlbumScreen}
          options={({ route }) => ({
            title: `${route.params?.teamIcon || '🏆'} ${route.params?.teamName || 'Album'}`,
            headerTitleAlign: 'center',
          })}
        />
        <Stack.Screen
          name="PackOpening"
          component={PackOpeningScreen}
          options={{
            title: '🎁 Opening Pack',
            headerTitleAlign: 'center',
            headerLeft: null,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
