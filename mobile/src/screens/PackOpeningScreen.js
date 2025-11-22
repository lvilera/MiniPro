import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import Card from '../components/Card';

export default function PackOpeningScreen({ route, navigation }) {
  const { cards = [] } = route.params || {};
  const [revealedCards, setRevealedCards] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Reveal cards one by one with animation
    cards.forEach((card, index) => {
      setTimeout(() => {
        setRevealedCards((prev) => [...prev, card]);
      }, index * 500);
    });

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    navigation.goBack();
  };

  const renderCard = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            scale: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        ],
      }}
    >
      <Card card={item} style={styles.card} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎁 Pack Opened!</Text>
        <Text style={styles.subtitle}>
          You received {cards.length} card{cards.length !== 1 ? 's' : ''}!
        </Text>
      </View>

      <FlatList
        data={revealedCards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      />

      {revealedCards.length === cards.length && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#00ffcc',
  },
  title: {
    color: '#00ffcc',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
  },
  cardsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    marginHorizontal: 10,
  },
  continueButton: {
    backgroundColor: '#00ffcc',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#0a0e27',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
