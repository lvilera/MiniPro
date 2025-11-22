import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  GAME_STATE: '@sports_card_game:state',
  REDEEMED_CODES: '@sports_card_game:codes',
  LAST_LOGIN: '@sports_card_game:last_login',
};

class StorageService {
  async saveGameState(state) {
    try {
      const data = {
        coins: state.coins,
        inventory: state.inventory,
        cardIdCounter: state.cardIdCounter,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving game state:', error);
      return false;
    }
  }

  async loadGameState() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading game state:', error);
      return null;
    }
  }

  async saveRedeemedCodes(codes) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REDEEMED_CODES, JSON.stringify(codes));
      return true;
    } catch (error) {
      console.error('Error saving redeemed codes:', error);
      return false;
    }
  }

  async loadRedeemedCodes() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REDEEMED_CODES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading redeemed codes:', error);
      return [];
    }
  }

  async saveLastLogin(timestamp) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, timestamp.toString());
      return true;
    } catch (error) {
      console.error('Error saving last login:', error);
      return false;
    }
  }

  async loadLastLogin() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
      return data ? parseInt(data, 10) : null;
    } catch (error) {
      console.error('Error loading last login:', error);
      return null;
    }
  }

  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
}

export default new StorageService();
