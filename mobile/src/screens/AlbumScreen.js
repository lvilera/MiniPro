import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useGame } from '../utils/GameContext';
import GameService from '../services/GameService';
import Card from '../components/Card';
import StoreModal from '../components/StoreModal';

export default function AlbumScreen({ route, navigation }) {
  const { teamName, teamData } = route.params || {};
  const { getTeamCards, inventory } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [storeVisible, setStoreVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const teamCards = getTeamCards(teamName);
  const totalSlots = GameService.config.cardsPerTeam;

  // Create album slots (card numbers 1 to totalSlots)
  const albumSlots = Array.from({ length: totalSlots }, (_, i) => {
    const cardNumber = i + 1;
    const placedCard = teamCards.find((card) => card.number === cardNumber);
    return {
      number: cardNumber,
      card: placedCard || null,
    };
  });

  // Get available cards from inventory (same team, not in album)
  const availableCards = inventory.filter(
    (card) =>
      card.team === teamName &&
      !teamCards.some((tc) => tc.number === card.number)
  );

  // Filter logic
  const getFilteredSlots = () => {
    let filtered = albumSlots;

    if (filterMode === 'placed') {
      filtered = filtered.filter((slot) => slot.card !== null);
    } else if (filterMode === 'empty') {
      filtered = filtered.filter((slot) => slot.card === null);
    }

    if (searchQuery) {
      filtered = filtered.filter((slot) => {
        if (!slot.card) return false;
        return (
          slot.card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          slot.card.number.toString().includes(searchQuery)
        );
      });
    }

    return filtered;
  };

  const filteredSlots = getFilteredSlots();

  const handleSlotPress = (slot) => {
    if (slot.card) {
      Alert.alert(
        'Card Info',
        `${slot.card.name}\n#${slot.card.number}\nRarity: ${slot.card.rarity}`,
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } else {
      setSelectedSlot(slot.number);
    }
  };

  const handleCardPress = (card) => {
    if (selectedSlot) {
      if (card.number === selectedSlot) {
        Alert.alert('Success!', `Placed ${card.name} in slot #${card.number}`);
        setSelectedSlot(null);
      } else {
        Alert.alert(
          'Wrong Slot',
          `This card is #${card.number}, but you selected slot #${selectedSlot}`
        );
      }
    } else {
      Alert.alert(
        'Select a Slot',
        'First tap an empty slot in the album, then select a card to place'
      );
    }
  };

  const handlePackPurchased = (cards) => {
    setStoreVisible(false);
    navigation.navigate('PackOpening', { cards });
  };

  const renderSlot = ({ item }) => {
    const isSelected = item.number === selectedSlot;

    return (
      <TouchableOpacity
        style={[
          styles.slot,
          item.card && styles.slotFilled,
          isSelected && styles.slotSelected,
        ]}
        onPress={() => handleSlotPress(item)}
      >
        {item.card ? (
          <Card card={item.card} />
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.slotNumber}>#{item.number}</Text>
            <Text style={styles.emptyText}>Empty</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAvailableCard = ({ item }) => (
    <Card
      card={item}
      onPress={() => handleCardPress(item)}
      style={styles.availableCard}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cards..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterMode === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterMode('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterMode === 'all' && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterMode === 'placed' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterMode('placed')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterMode === 'placed' && styles.filterButtonTextActive,
              ]}
            >
              Placed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterMode === 'empty' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterMode('empty')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterMode === 'empty' && styles.filterButtonTextActive,
              ]}
            >
              Empty
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Album Grid */}
      <ScrollView style={styles.albumSection}>
        <Text style={styles.sectionTitle}>Album ({teamCards.length}/{totalSlots})</Text>
        {selectedSlot && (
          <Text style={styles.selectedSlotText}>
            Selected slot: #{selectedSlot} - Tap a matching card below
          </Text>
        )}
        <FlatList
          data={filteredSlots}
          renderItem={renderSlot}
          keyExtractor={(item) => `slot-${item.number}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContainer}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Available Cards */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>
          Your Cards ({availableCards.length})
        </Text>
        <FlatList
          data={availableCards}
          renderItem={renderAvailableCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        />
      </View>

      {/* Store Button */}
      <TouchableOpacity
        style={styles.storeButton}
        onPress={() => setStoreVisible(true)}
      >
        <Text style={styles.storeButtonText}>🛒</Text>
      </TouchableOpacity>

      {/* Store Modal */}
      <StoreModal
        visible={storeVisible}
        onClose={() => setStoreVisible(false)}
        onPackPurchased={handlePackPurchased}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  filterBar: {
    backgroundColor: '#1a1f3a',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#00ffcc',
  },
  searchInput: {
    backgroundColor: '#0a0e27',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00ffcc',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#0a0e27',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    borderColor: '#00ffcc',
  },
  filterButtonText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#00ffcc',
  },
  albumSection: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedSlotText: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  slot: {
    marginHorizontal: 5,
  },
  slotFilled: {
    opacity: 1,
  },
  slotSelected: {
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 8,
    padding: 2,
  },
  emptySlot: {
    width: 140,
    height: 200,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00ffcc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotNumber: {
    color: '#00ffcc',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    color: '#666',
    fontSize: 12,
  },
  cardsSection: {
    backgroundColor: '#1a1f3a',
    paddingVertical: 15,
    borderTopWidth: 2,
    borderTopColor: '#00ffcc',
    maxHeight: 250,
  },
  cardsContainer: {
    paddingHorizontal: 10,
    gap: 10,
  },
  availableCard: {
    marginRight: 10,
  },
  storeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00ffcc',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  storeButtonText: {
    fontSize: 28,
  },
});
