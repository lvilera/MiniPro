import React from 'react';
import { GameProvider } from './src/utils/GameContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GameProvider>
      <AppNavigator />
    </GameProvider>
  );
}
