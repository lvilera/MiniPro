import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useGame } from '../utils/GameContext';
import GameService from '../services/GameService';
import TeamTile from '../components/TeamTile';
import StoreModal from '../components/StoreModal';

export default function DashboardScreen({ navigation }) {
  const { coins, getStats, getTeamCards } = useGame();
  const [sportFilter, setSportFilter] = useState('all');
  const [storeVisible, setStoreVisible] = useState(false);

  const stats = getStats();
  const teams = GameService.getFilteredTeams(sportFilter);

  const handleTeamPress = (team) => {
    navigation.navigate('Album', {
      teamName: team.name,
      teamIcon: team.icon,
      teamData: team,
    });
  };

  const handlePackPurchased = (cards) => {
    setStoreVisible(false);
    navigation.navigate('PackOpening', { cards });
  };

  const renderTeam = ({ item }) => {
    const teamCards = getTeamCards(item.name);
    return (
      <TeamTile
        team={item}
        cardCount={teamCards.length}
        totalCards={GameService.config.cardsPerTeam}
        onPress={() => handleTeamPress(item)}
      />
    );
  };

  const renderSportFilter = (sport, label, icon) => (
    <TouchableOpacity
      key={sport}
      style={[
        styles.filterButton,
        sportFilter === sport && styles.filterButtonActive,
      ]}
      onPress={() => setSportFilter(sport)}
    >
      <Text style={styles.filterIcon}>{icon}</Text>
      <Text
        style={[
          styles.filterText,
          sportFilter === sport && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e27" />

      {/* Currency Bar */}
      <View style={styles.currencyBar}>
        <Text style={styles.currencyLabel}>Coins:</Text>
        <Text style={styles.currencyAmount}>{coins} 💰</Text>
      </View>

      {/* Stats Panel */}
      <View style={styles.statsPanel}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Cards</Text>
          <Text style={styles.statValue}>{stats.totalCards}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Unique Teams</Text>
          <Text style={styles.statValue}>{stats.uniqueTeams}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Completion</Text>
          <Text style={styles.statValue}>{stats.completion}%</Text>
        </View>
      </View>

      {/* Sport Filters */}
      <View style={styles.filtersContainer}>
        {renderSportFilter('all', 'ALL SPORTS', '🏆')}
        {renderSportFilter('MLB', 'BASEBALL', '⚾')}
        {renderSportFilter('NBA', 'BASKETBALL', '🏀')}
        {renderSportFilter('NHL', 'HOCKEY', '🏒')}
      </View>

      {/* Teams Grid */}
      <FlatList
        data={teams}
        renderItem={renderTeam}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Store Button */}
      <TouchableOpacity
        style={styles.storeButton}
        onPress={() => setStoreVisible(true)}
      >
        <Text style={styles.storeButtonText}>🛒 STORE</Text>
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
  currencyBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#00ffcc',
  },
  currencyLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  currencyAmount: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1f3a',
    padding: 15,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  statValue: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    borderColor: '#00ffcc',
    backgroundColor: '#0a0e27',
  },
  filterIcon: {
    fontSize: 16,
    marginBottom: 5,
  },
  filterText: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#00ffcc',
  },
  gridContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  storeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00ffcc',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  storeButtonText: {
    color: '#0a0e27',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
