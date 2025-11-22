import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useGame } from '../utils/GameContext';

export default function StoreModal({ visible, onClose, onPackPurchased }) {
  const { coins, buyPack, redeemPromoCode } = useGame();
  const [promoCode, setPromoCode] = useState('');

  const handleBuyPack = () => {
    const result = buyPack();
    if (result.success) {
      onPackPurchased(result.cards);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleRedeemCode = () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    const result = redeemPromoCode(promoCode);
    if (result.success) {
      setPromoCode('');
      Alert.alert('Success!', result.message);
      onPackPurchased(result.cards);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>🛒 CARD STORE</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Current Coins */}
            <View style={styles.coinsDisplay}>
              <Text style={styles.coinsLabel}>Your Coins:</Text>
              <Text style={styles.coinsAmount}>{coins} 💰</Text>
            </View>

            {/* Standard Pack */}
            <TouchableOpacity
              style={styles.packOption}
              onPress={handleBuyPack}
              activeOpacity={0.7}
            >
              <View style={styles.packInfo}>
                <Text style={styles.packTitle}>Standard Pack</Text>
                <Text style={styles.packDescription}>
                  5 random cards from all teams
                </Text>
                <Text style={styles.packOdds}>
                  70% Common, 20% Rare, 8% Epic, 2% Legendary
                </Text>
              </View>
              <View style={styles.packPrice}>
                <Text style={styles.priceText}>100 💰</Text>
              </View>
            </TouchableOpacity>

            {/* Promo Code Section */}
            <View style={styles.promoSection}>
              <Text style={styles.promoTitle}>🎟️ PROMO CODE</Text>
              <Text style={styles.promoDescription}>
                Have a sponsor code? Enter it below to claim your free cards!
              </Text>

              <View style={styles.promoInputContainer}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter code (e.g. COKE-NBA-2024)"
                  placeholderTextColor="#666"
                  value={promoCode}
                  onChangeText={setPromoCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.redeemButton}
                  onPress={handleRedeemCode}
                >
                  <Text style={styles.redeemButtonText}>REDEEM</Text>
                </TouchableOpacity>
              </View>

              {/* Demo Codes */}
              <View style={styles.demoCodes}>
                <Text style={styles.demoCodesLabel}>Demo Codes (Try These!):</Text>
                <View style={styles.demoCodesList}>
                  <Text style={styles.demoCode}>COKE-NBA-2024 - 5 Basketball cards</Text>
                  <Text style={styles.demoCode}>NIKE-MLB-PROMO - 5 Baseball cards</Text>
                  <Text style={styles.demoCode}>TIMHORTONS-NHL - 5 Hockey cards</Text>
                  <Text style={styles.demoCode}>GATORADE-LEGEND - 3 cards, 1 guaranteed rare+</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00ffcc',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00ffcc',
  },
  title: {
    color: '#00ffcc',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    color: '#00ffcc',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  coinsDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  coinsLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  coinsAmount: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  packOption: {
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00ffcc',
  },
  packInfo: {
    marginBottom: 10,
  },
  packTitle: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  packDescription: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  packOdds: {
    color: '#aaa',
    fontSize: 12,
  },
  packPrice: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#00ffcc',
  },
  priceText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  promoSection: {
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 15,
  },
  promoTitle: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promoDescription: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 15,
  },
  promoInputContainer: {
    marginBottom: 15,
  },
  promoInput: {
    backgroundColor: '#1a1f3a',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00ffcc',
    fontSize: 16,
    marginBottom: 10,
  },
  redeemButton: {
    backgroundColor: '#00ffcc',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: '#0a0e27',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoCodes: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#00ffcc',
  },
  demoCodesLabel: {
    color: '#00ffcc',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  demoCodesList: {
    gap: 5,
  },
  demoCode: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
});
