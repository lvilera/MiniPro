import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Card({ card, onPress, style }) {
  const rarityColor = card.color || '#9E9E9E';
  const primaryColor = card.primaryColor || '#0a0e27';

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: rarityColor }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.cardHeader, { backgroundColor: primaryColor }]}>
        <Text style={styles.icon}>{card.icon}</Text>
        <Text style={styles.cardNumber}>#{card.number}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.playerName} numberOfLines={1}>
          {card.name}
        </Text>
        <Text style={styles.teamName} numberOfLines={1}>
          {card.team}
        </Text>
        <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
          <Text style={styles.rarityText}>{card.rarity.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 200,
    borderRadius: 8,
    borderWidth: 3,
    backgroundColor: '#1a1f3a',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    fontSize: 24,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    color: '#00ffcc',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  teamName: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 'auto',
  },
  rarityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
