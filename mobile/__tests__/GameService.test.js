import GameService from '../src/services/GameService';

describe('GameService', () => {
  test('should generate a random player name', () => {
    const name = GameService.generatePlayerName();
    expect(name).toBeDefined();
    expect(typeof name).toBe('string');
    expect(name.split(' ')).toHaveLength(2);
  });

  test('should generate card with correct properties', () => {
    const card = GameService.generateCard(null, 1);
    expect(card).toHaveProperty('id');
    expect(card).toHaveProperty('team');
    expect(card).toHaveProperty('league');
    expect(card).toHaveProperty('number');
    expect(card).toHaveProperty('name');
    expect(card).toHaveProperty('rarity');
    expect(['common', 'rare', 'epic', 'legendary']).toContain(card.rarity);
  });

  test('should open standard pack with 5 cards', () => {
    const result = GameService.openStandardPack(1);
    expect(result.cards).toHaveLength(5);
    expect(result.nextIdCounter).toBe(6);
  });

  test('should redeem valid promo code', () => {
    const result = GameService.redeemPromoCode('COKE-NBA-2024', [], 1);
    expect(result.success).toBe(true);
    expect(result.cards).toHaveLength(5);
  });

  test('should reject already redeemed code', () => {
    const result = GameService.redeemPromoCode('COKE-NBA-2024', ['COKE-NBA-2024'], 1);
    expect(result.success).toBe(false);
    expect(result.message).toContain('already been redeemed');
  });

  test('should reject invalid promo code', () => {
    const result = GameService.redeemPromoCode('INVALID-CODE', [], 1);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid');
  });

  test('should calculate stats correctly', () => {
    const inventory = [
      { team: 'Lakers', number: 1 },
      { team: 'Lakers', number: 2 },
      { team: 'Celtics', number: 1 },
    ];
    const stats = GameService.calculateStats(inventory);
    expect(stats.totalCards).toBe(3);
    expect(stats.uniqueTeams).toBe(2);
  });

  test('should detect daily bonus availability', () => {
    const yesterday = Date.now() - (24 * 60 * 60 * 1000);
    expect(GameService.isDailyBonusAvailable(yesterday)).toBe(true);
    expect(GameService.isDailyBonusAvailable(Date.now())).toBe(false);
    expect(GameService.isDailyBonusAvailable(null)).toBe(true);
  });
});
