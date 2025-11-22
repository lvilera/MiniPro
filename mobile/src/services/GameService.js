import gameData from '../constants/gameData.json';

class GameService {
  constructor() {
    this.teams = gameData.teams;
    this.promoCodes = gameData.promoCodes;
    this.playerNames = gameData.playerNames;
    this.config = gameData.config;
  }

  // Generate a random player name
  generatePlayerName() {
    const firstName = this.playerNames.firstNames[
      Math.floor(Math.random() * this.playerNames.firstNames.length)
    ];
    const lastName = this.playerNames.lastNames[
      Math.floor(Math.random() * this.playerNames.lastNames.length)
    ];
    return `${firstName} ${lastName}`;
  }

  // Generate card rarity based on odds
  generateRarity(guaranteedRarity = null) {
    if (guaranteedRarity) {
      return guaranteedRarity;
    }

    const rand = Math.random() * 100;
    const odds = this.config.rarityOdds;

    if (rand < odds.legendary) return 'legendary';
    if (rand < odds.legendary + odds.epic) return 'epic';
    if (rand < odds.legendary + odds.epic + odds.rare) return 'rare';
    return 'common';
  }

  // Get rarity color
  getRarityColor(rarity) {
    const colors = {
      common: '#9E9E9E',
      rare: '#2196F3',
      epic: '#9C27B0',
      legendary: '#FFD700',
    };
    return colors[rarity] || colors.common;
  }

  // Generate a single card
  generateCard(teamFilter = null, cardIdCounter = 1, guaranteedRarity = null) {
    const availableTeams = teamFilter
      ? this.teams.filter(t => t.league === teamFilter)
      : this.teams;

    if (availableTeams.length === 0) {
      return null;
    }

    const team = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    const cardNumber = Math.floor(Math.random() * this.config.cardsPerTeam) + 1;
    const rarity = this.generateRarity(guaranteedRarity);

    return {
      id: cardIdCounter,
      team: team.name,
      league: team.league,
      number: cardNumber,
      name: this.generatePlayerName(),
      rarity,
      color: this.getRarityColor(rarity),
      primaryColor: team.primaryColor,
      icon: team.icon,
    };
  }

  // Open a standard pack
  openStandardPack(cardIdCounter) {
    const cards = [];
    for (let i = 0; i < this.config.standardPackSize; i++) {
      cards.push(this.generateCard(null, cardIdCounter + i));
    }
    return {
      cards,
      nextIdCounter: cardIdCounter + this.config.standardPackSize,
    };
  }

  // Redeem promo code
  redeemPromoCode(code, redeemedCodes, cardIdCounter) {
    const upperCode = code.toUpperCase().trim();

    if (redeemedCodes.includes(upperCode)) {
      return {
        success: false,
        message: 'This code has already been redeemed!',
      };
    }

    const promoData = this.promoCodes[upperCode];
    if (!promoData) {
      return {
        success: false,
        message: 'Invalid promo code!',
      };
    }

    const cards = [];
    const teamFilter = promoData.league === 'all' ? null : promoData.league;

    for (let i = 0; i < promoData.cardCount; i++) {
      const guaranteedRarity =
        promoData.guaranteed && i === promoData.cardCount - 1
          ? promoData.guaranteed
          : null;

      cards.push(this.generateCard(teamFilter, cardIdCounter + i, guaranteedRarity));
    }

    return {
      success: true,
      message: `Redeemed ${promoData.sponsor} pack!`,
      cards,
      nextIdCounter: cardIdCounter + promoData.cardCount,
      code: upperCode,
      promoData,
    };
  }

  // Calculate collection stats
  calculateStats(inventory) {
    const uniqueTeams = new Set(inventory.map(card => card.team)).size;
    const totalCards = inventory.length;
    const totalPossible = this.teams.length * this.config.cardsPerTeam;
    const completion = totalPossible > 0
      ? Math.round((totalCards / totalPossible) * 100)
      : 0;

    return {
      totalCards,
      uniqueTeams,
      completion,
    };
  }

  // Check if it's a new day for daily bonus
  isDailyBonusAvailable(lastLoginTimestamp) {
    if (!lastLoginTimestamp) return true;

    const lastLogin = new Date(lastLoginTimestamp);
    const now = new Date();

    return (
      lastLogin.getDate() !== now.getDate() ||
      lastLogin.getMonth() !== now.getMonth() ||
      lastLogin.getFullYear() !== now.getFullYear()
    );
  }

  // Get teams by sport filter
  getFilteredTeams(sportFilter) {
    if (sportFilter === 'all') return this.teams;
    return this.teams.filter(team => team.league === sportFilter);
  }

  // Get team data by name
  getTeamByName(teamName) {
    return this.teams.find(team => team.name === teamName);
  }

  // Get cards for a specific team from inventory
  getTeamCards(teamName, inventory) {
    return inventory.filter(card => card.team === teamName);
  }

  // Get sport icon
  getSportIcon(league) {
    const icons = {
      MLB: '⚾',
      NBA: '🏀',
      NHL: '🏒',
    };
    return icons[league] || '🏆';
  }
}

export default new GameService();
