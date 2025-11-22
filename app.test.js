/**
 * Unit Tests for Sports Card Album Application
 */

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

global.localStorage = localStorageMock;

// Mock alert
global.alert = jest.fn();

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            promoCodes: {
                'TEST-CODE': {
                    sponsor: 'Test',
                    league: 'MLB',
                    cardCount: 5,
                    description: 'Test Pack',
                    color: '#000000',
                    guaranteed: null
                }
            },
            teams: [
                {
                    name: 'Test Team',
                    league: 'MLB',
                    scheme: 'scheme-cosmos',
                    icon: '⚾',
                    primaryColor: '#000000'
                }
            ],
            playerNames: {
                firstNames: ['John', 'Mike'],
                lastNames: ['Doe', 'Smith']
            },
            config: {
                cardsPerTeam: 300,
                startingCoins: 500,
                dailyBonus: 50,
                standardPackPrice: 100,
                standardPackSize: 5,
                rarityOdds: {
                    common: 70,
                    rare: 20,
                    epic: 8,
                    legendary: 2
                }
            }
        })
    })
);

describe('Utility Functions', () => {
    describe('debounce', () => {
        jest.useFakeTimers();

        test('should debounce function calls', () => {
            const func = jest.fn();
            const debounce = (fn, delay) => {
                let timeoutId;
                return (...args) => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => fn(...args), delay);
                };
            };
            const debouncedFunc = debounce(func, 300);

            debouncedFunc();
            debouncedFunc();
            debouncedFunc();

            expect(func).not.toHaveBeenCalled();

            jest.advanceTimersByTime(300);

            expect(func).toHaveBeenCalledTimes(1);
        });

        jest.useRealTimers();
    });

    describe('safeJSONParse', () => {
        const safeJSONParse = (data, defaultValue = null) => {
            try {
                return JSON.parse(data);
            } catch (e) {
                return defaultValue;
            }
        };

        test('should parse valid JSON', () => {
            const result = safeJSONParse('{"test": "value"}');
            expect(result).toEqual({ test: 'value' });
        });

        test('should return default value for invalid JSON', () => {
            const result = safeJSONParse('invalid json', { default: true });
            expect(result).toEqual({ default: true });
        });

        test('should return null by default for invalid JSON', () => {
            const result = safeJSONParse('invalid json');
            expect(result).toBeNull();
        });
    });

    describe('safeGetStorage', () => {
        const safeGetStorage = (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        };

        beforeEach(() => {
            localStorage.clear();
        });

        test('should retrieve stored value', () => {
            localStorage.setItem('test', JSON.stringify({ value: 123 }));
            const result = safeGetStorage('test');
            expect(result).toEqual({ value: 123 });
        });

        test('should return default value for non-existent key', () => {
            const result = safeGetStorage('nonexistent', { default: true });
            expect(result).toEqual({ default: true });
        });
    });

    describe('safeSetStorage', () => {
        const safeSetStorage = (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                return false;
            }
        };

        beforeEach(() => {
            localStorage.clear();
        });

        test('should store value successfully', () => {
            const result = safeSetStorage('test', { value: 123 });
            expect(result).toBe(true);
            expect(localStorage.getItem('test')).toBe('{"value":123}');
        });
    });
});

describe('Game Logic', () => {
    describe('Rarity Determination', () => {
        const determineRarity = (config) => {
            const roll = Math.random() * 100;
            const odds = config.rarityOdds || { common: 70, rare: 20, epic: 8, legendary: 2 };

            if (roll < odds.common) return 'common';
            if (roll < odds.common + odds.rare) return 'rare';
            if (roll < odds.common + odds.rare + odds.epic) return 'epic';
            return 'legendary';
        };

        test('should return valid rarity', () => {
            const config = {
                rarityOdds: { common: 70, rare: 20, epic: 8, legendary: 2 }
            };
            const rarity = determineRarity(config);
            expect(['common', 'rare', 'epic', 'legendary']).toContain(rarity);
        });
    });

    describe('Player Name Generation', () => {
        const generatePlayerName = (playerNames) => {
            const firstNames = playerNames.firstNames || ['Player'];
            const lastNames = playerNames.lastNames || ['Name'];

            return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' +
                   lastNames[Math.floor(Math.random() * lastNames.length)];
        };

        test('should generate valid player name', () => {
            const playerNames = {
                firstNames: ['John', 'Mike'],
                lastNames: ['Doe', 'Smith']
            };
            const name = generatePlayerName(playerNames);
            expect(name).toMatch(/^(John|Mike) (Doe|Smith)$/);
        });

        test('should use defaults if names not provided', () => {
            const name = generatePlayerName({});
            expect(name).toBe('Player Name');
        });
    });

    describe('Card Placement Validation', () => {
        const canPlaceCardInSlot = (card, slot) => {
            if (slot.id === 'user-cards') {
                return true;
            }

            if (slot.classList && slot.classList.contains('grid-card')) {
                const cardNumber = parseInt(card.dataset.cardNumber);
                const slotNumber = parseInt(slot.dataset.slot);
                const cardTeam = card.dataset.cardTeam;
                const slotTeam = slot.dataset.team;

                return cardNumber === slotNumber && cardTeam === slotTeam;
            }

            return false;
        };

        test('should allow card return to user strip', () => {
            const card = { dataset: { cardNumber: '1', cardTeam: 'Yankees' } };
            const slot = { id: 'user-cards' };
            expect(canPlaceCardInSlot(card, slot)).toBe(true);
        });

        test('should allow card placement in matching slot', () => {
            const card = { dataset: { cardNumber: '5', cardTeam: 'Yankees' } };
            const slot = {
                classList: { contains: (cls) => cls === 'grid-card' },
                dataset: { slot: '5', team: 'Yankees' }
            };
            expect(canPlaceCardInSlot(card, slot)).toBe(true);
        });

        test('should reject card with wrong number', () => {
            const card = { dataset: { cardNumber: '5', cardTeam: 'Yankees' } };
            const slot = {
                classList: { contains: (cls) => cls === 'grid-card' },
                dataset: { slot: '10', team: 'Yankees' }
            };
            expect(canPlaceCardInSlot(card, slot)).toBe(false);
        });

        test('should reject card with wrong team', () => {
            const card = { dataset: { cardNumber: '5', cardTeam: 'Yankees' } };
            const slot = {
                classList: { contains: (cls) => cls === 'grid-card' },
                dataset: { slot: '5', team: 'Red Sox' }
            };
            expect(canPlaceCardInSlot(card, slot)).toBe(false);
        });

        test('should reject card with wrong team and number', () => {
            const card = { dataset: { cardNumber: '5', cardTeam: 'Yankees' } };
            const slot = {
                classList: { contains: (cls) => cls === 'grid-card' },
                dataset: { slot: '10', team: 'Red Sox' }
            };
            expect(canPlaceCardInSlot(card, slot)).toBe(false);
        });
    });

    describe('Pack Generation', () => {
        const generatePackCards = (count, league, guaranteedRarity, teamsData, config) => {
            const pack = [];
            let availableTeams = teamsData;

            if (league !== 'all') {
                availableTeams = teamsData.filter(t => t.league === league);
            }

            if (availableTeams.length === 0) {
                return pack;
            }

            for (let i = 0; i < count; i++) {
                const team = availableTeams[0];
                const cardNumber = Math.floor(Math.random() * (config.cardsPerTeam || 300)) + 1;

                pack.push({
                    id: 'card-' + i,
                    team: team.name,
                    league: team.league,
                    number: cardNumber,
                    rarity: 'common',
                    playerName: 'Test Player'
                });
            }

            return pack;
        };

        test('should generate correct number of cards', () => {
            const teams = [{ name: 'Yankees', league: 'MLB' }];
            const config = { cardsPerTeam: 300 };
            const pack = generatePackCards(5, 'all', null, teams, config);
            expect(pack).toHaveLength(5);
        });

        test('should filter by league', () => {
            const teams = [
                { name: 'Yankees', league: 'MLB' },
                { name: 'Lakers', league: 'NBA' }
            ];
            const config = { cardsPerTeam: 300 };
            const pack = generatePackCards(5, 'MLB', null, teams, config);
            pack.forEach(card => {
                expect(card.league).toBe('MLB');
            });
        });

        test('should return empty pack if no teams available', () => {
            const teams = [];
            const config = { cardsPerTeam: 300 };
            const pack = generatePackCards(5, 'all', null, teams, config);
            expect(pack).toHaveLength(0);
        });
    });
});

describe('State Management', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('saveGameState', () => {
        const saveGameState = (state) => {
            const data = {
                coins: state.coins,
                inventory: state.userInventory,
                cardIdCounter: state.cardIdCounter,
                redeemedCodes: state.redeemedCodes,
                lastLogin: new Date().toDateString()
            };

            localStorage.setItem('sportsCardGame', JSON.stringify(data));
        };

        test('should save game state to localStorage', () => {
            const state = {
                coins: 500,
                userInventory: [],
                cardIdCounter: 1,
                redeemedCodes: []
            };

            saveGameState(state);

            const saved = localStorage.getItem('sportsCardGame');
            expect(saved).toBeTruthy();

            const parsed = JSON.parse(saved);
            expect(parsed.coins).toBe(500);
            expect(parsed.inventory).toEqual([]);
        });
    });

    describe('loadGameState', () => {
        const loadGameState = () => {
            try {
                const saved = localStorage.getItem('sportsCardGame');
                if (saved) {
                    const data = JSON.parse(saved);
                    return {
                        coins: data.coins || 500,
                        userInventory: data.inventory || [],
                        cardIdCounter: data.cardIdCounter || 1,
                        redeemedCodes: data.redeemedCodes || []
                    };
                }
            } catch (e) {
                return {
                    coins: 500,
                    userInventory: [],
                    cardIdCounter: 1,
                    redeemedCodes: []
                };
            }
        };

        test('should load saved state', () => {
            const savedData = {
                coins: 1000,
                inventory: [{ id: 'card-1' }],
                cardIdCounter: 2,
                redeemedCodes: ['CODE1']
            };
            localStorage.setItem('sportsCardGame', JSON.stringify(savedData));

            const state = loadGameState();
            expect(state.coins).toBe(1000);
            expect(state.userInventory).toHaveLength(1);
        });

        test('should return defaults if no saved state', () => {
            const state = loadGameState();
            expect(state.coins).toBe(500);
            expect(state.userInventory).toEqual([]);
        });
    });
});

describe('Promo Code System', () => {
    describe('Code Validation', () => {
        const isValidPromoCode = (code, promoCodes, redeemedCodes) => {
            if (!code) return { valid: false, reason: 'empty' };
            if (!promoCodes[code]) return { valid: false, reason: 'invalid' };
            if (redeemedCodes.includes(code)) return { valid: false, reason: 'redeemed' };
            return { valid: true };
        };

        test('should reject empty code', () => {
            const result = isValidPromoCode('', {}, []);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('empty');
        });

        test('should reject invalid code', () => {
            const promoCodes = { 'VALID': {} };
            const result = isValidPromoCode('INVALID', promoCodes, []);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('invalid');
        });

        test('should reject already redeemed code', () => {
            const promoCodes = { 'CODE1': {} };
            const redeemedCodes = ['CODE1'];
            const result = isValidPromoCode('CODE1', promoCodes, redeemedCodes);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('redeemed');
        });

        test('should accept valid unredeemed code', () => {
            const promoCodes = { 'CODE1': {} };
            const redeemedCodes = [];
            const result = isValidPromoCode('CODE1', promoCodes, redeemedCodes);
            expect(result.valid).toBe(true);
        });
    });
});

describe('Error Handling', () => {
    const handleError = (error, context) => {
        console.error(`Error in ${context}:`, error);
        return { context, message: error.message };
    };

    test('should handle errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const error = new Error('Test error');
        const result = handleError(error, 'testFunction');

        expect(consoleSpy).toHaveBeenCalledWith('Error in testFunction:', error);
        expect(result.context).toBe('testFunction');
        expect(result.message).toBe('Test error');

        consoleSpy.mockRestore();
    });
});
