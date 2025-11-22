import React, { createContext, useState, useEffect, useContext } from 'react';
import GameService from '../services/GameService';
import StorageService from '../services/StorageService';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [coins, setCoins] = useState(GameService.config.startingCoins);
  const [inventory, setInventory] = useState([]);
  const [cardIdCounter, setCardIdCounter] = useState(1);
  const [redeemedCodes, setRedeemedCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load game state on mount
  useEffect(() => {
    loadGameState();
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (!loading) {
      saveGameState();
    }
  }, [coins, inventory, cardIdCounter, loading]);

  const loadGameState = async () => {
    try {
      const state = await StorageService.loadGameState();
      const codes = await StorageService.loadRedeemedCodes();
      const lastLogin = await StorageService.loadLastLogin();

      if (state) {
        setCoins(state.coins || GameService.config.startingCoins);
        setInventory(state.inventory || []);
        setCardIdCounter(state.cardIdCounter || 1);
      }

      setRedeemedCodes(codes);

      // Check for daily bonus
      if (GameService.isDailyBonusAvailable(lastLogin)) {
        const bonus = GameService.config.dailyBonus;
        setCoins(prev => prev + bonus);
        await StorageService.saveLastLogin(Date.now());
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGameState = async () => {
    const state = {
      coins,
      inventory,
      cardIdCounter,
    };
    await StorageService.saveGameState(state);
    await StorageService.saveRedeemedCodes(redeemedCodes);
  };

  const buyPack = () => {
    const price = GameService.config.standardPackPrice;
    if (coins < price) {
      return { success: false, message: 'Not enough coins!' };
    }

    const result = GameService.openStandardPack(cardIdCounter);
    setCoins(coins - price);
    setInventory([...inventory, ...result.cards]);
    setCardIdCounter(result.nextIdCounter);

    return { success: true, cards: result.cards };
  };

  const redeemPromoCode = (code) => {
    const result = GameService.redeemPromoCode(code, redeemedCodes, cardIdCounter);

    if (result.success) {
      setInventory([...inventory, ...result.cards]);
      setCardIdCounter(result.nextIdCounter);
      setRedeemedCodes([...redeemedCodes, result.code]);
    }

    return result;
  };

  const addCoins = (amount) => {
    setCoins(coins + amount);
  };

  const removeCardFromInventory = (cardId) => {
    setInventory(inventory.filter(card => card.id !== cardId));
  };

  const getStats = () => {
    return GameService.calculateStats(inventory);
  };

  const getTeamCards = (teamName) => {
    return GameService.getTeamCards(teamName, inventory);
  };

  const value = {
    coins,
    inventory,
    cardIdCounter,
    redeemedCodes,
    loading,
    buyPack,
    redeemPromoCode,
    addCoins,
    removeCardFromInventory,
    getStats,
    getTeamCards,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
