import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TeamTile({ team, cardCount, totalCards, onPress }) {
  const progress = totalCards > 0 ? (cardCount / totalCards) * 100 : 0;

  return (
    <TouchableOpacity
      style={[styles.tile, { borderColor: team.primaryColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{team.icon}</Text>
      <Text style={styles.teamName}>{team.name}</Text>
      <Text style={styles.league}>{team.league}</Text>
      <Text style={styles.progress}>
        {cardCount} / {totalCards} Cards
      </Text>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress}%`, backgroundColor: team.primaryColor },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    borderWidth: 2,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  teamName: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  league: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 10,
  },
  progress: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#0a0e27',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
