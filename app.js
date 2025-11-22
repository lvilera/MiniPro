// ============================================================
// SPORTS CARD ALBUM APPLICATION
// ============================================================

/**
 * Utility function for debouncing
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Error handler utility
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // In production, you might want to send to error tracking service
}

/**
 * Safe JSON parse with error handling
 * @param {string} data - JSON string to parse
 * @param {*} defaultValue - Default value if parse fails
 * @returns {*} Parsed data or default value
 */
function safeJSONParse(data, defaultValue = null) {
    try {
        return JSON.parse(data);
    } catch (e) {
        handleError(e, 'safeJSONParse');
        return defaultValue;
    }
}

/**
 * Safe localStorage getter
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
function safeGetStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? safeJSONParse(item, defaultValue) : defaultValue;
    } catch (e) {
        handleError(e, 'safeGetStorage');
        return defaultValue;
    }
}

/**
 * Safe localStorage setter
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
function safeSetStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        handleError(e, 'safeSetStorage');
        return false;
    }
}

// ============================================================
// GLOBAL STATE & ELEMENTS
// ============================================================
const state = {
    currentTeamKey: '',
    currentTeam: null,
    currentSportFilter: 'all',
    userInventory: [],
    coins: 500,
    cardIdCounter: 1,
    draggedCardElement: null,
    redeemedCodes: [],
    teamsData: [],
    promoCodes: {},
    playerNames: { firstNames: [], lastNames: [] },
    config: {}
};

const elements = {
    dashboardPage: null,
    appPage: null,
    pageContainer: null,
    theGrid: null,
    userStrip: null,
    currentLeagueHeader: null,
    searchInput: null,
    filterSelect: null,
    logoList: null,
    backToDashboard: null,
    storeButton: null,
    storeButtonAlbum: null,
    storeModal: null,
    closeStore: null,
    buyStandardPack: null,
    packOpeningModal: null,
    coinDisplay: null
};

// ============================================================
// INITIALIZATION
// ============================================================
async function init() {
    try {
        // Cache DOM elements
        cacheElements();

        // Load external data
        await loadGameData();

        // Load saved state
        loadGameState();

        // Setup UI
        updateCurrencyDisplay();
        updateDashboardStats();
        checkDailyBonus();
        populateTeamLogos('all');

        // Attach event listeners
        attachEventListeners();

        // Set initial focus for accessibility
        if (elements.dashboardPage) {
            const firstButton = elements.dashboardPage.querySelector('.sport-button');
            if (firstButton) firstButton.focus();
        }
    } catch (error) {
        handleError(error, 'init');
        alert('Failed to initialize application. Please refresh the page.');
    }
}

/**
 * Cache all DOM elements
 */
function cacheElements() {
    elements.dashboardPage = document.getElementById('dashboard-page');
    elements.appPage = document.getElementById('app-page');
    elements.pageContainer = document.getElementById('page-container');
    elements.theGrid = document.getElementById('the-grid');
    elements.userStrip = document.getElementById('user-cards');
    elements.currentLeagueHeader = document.getElementById('current-league-header');
    elements.searchInput = document.getElementById('search-input');
    elements.filterSelect = document.getElementById('filter-select');
    elements.logoList = document.getElementById('logo-list');
    elements.backToDashboard = document.getElementById('back-to-dashboard');
    elements.storeButton = document.getElementById('store-button');
    elements.storeButtonAlbum = document.getElementById('store-button-album');
    elements.storeModal = document.getElementById('store-modal');
    elements.closeStore = document.getElementById('close-store');
    elements.buyStandardPack = document.getElementById('buy-standard-pack');
    elements.packOpeningModal = document.getElementById('pack-opening-modal');
    elements.coinDisplay = document.getElementById('coin-display');
}

/**
 * Load game data from external JSON file
 */
async function loadGameData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load game data');
        }
        const data = await response.json();

        state.teamsData = data.teams || [];
        state.promoCodes = data.promoCodes || {};
        state.playerNames = data.playerNames || { firstNames: [], lastNames: [] };
        state.config = data.config || {};

        // Populate dashboard with teams
        populateDashboardTeams();
    } catch (error) {
        handleError(error, 'loadGameData');
        // Fallback to default data if needed
        alert('Failed to load game data. Using default configuration.');
    }
}

/**
 * Populate dashboard with team tiles
 */
function populateDashboardTeams() {
    const grid = document.getElementById('team-select-grid');
    if (!grid) return;

    grid.innerHTML = '';

    state.teamsData.forEach(team => {
        const tile = document.createElement('div');
        tile.className = 'team-tile';
        tile.setAttribute('data-team', team.name);
        tile.setAttribute('data-league', team.league);
        tile.setAttribute('data-scheme', team.scheme);
        tile.setAttribute('role', 'button');
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('aria-label', `View ${team.name} collection`);
        tile.style.setProperty('--local-primary', team.primaryColor);

        tile.innerHTML = `
            <div class="tile-logo">${team.icon}</div>
            <div class="tile-name">${team.name}</div>
            <div class="tile-progress">0 / ${state.config.cardsPerTeam || 300} Cards</div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: 0%;"></div>
            </div>
        `;

        grid.appendChild(tile);
    });
}

// ============================================================
// GAME STATE MANAGEMENT
// ============================================================
function loadGameState() {
    const saved = safeGetStorage('sportsCardGame', {});

    state.coins = saved.coins || state.config.startingCoins || 500;
    state.userInventory = saved.inventory || [];
    state.cardIdCounter = saved.cardIdCounter || 1;
    state.redeemedCodes = saved.redeemedCodes || [];
}

function saveGameState() {
    const data = {
        coins: state.coins,
        inventory: state.userInventory,
        cardIdCounter: state.cardIdCounter,
        redeemedCodes: state.redeemedCodes,
        lastLogin: new Date().toDateString()
    };

    safeSetStorage('sportsCardGame', data);
}

function checkDailyBonus() {
    try {
        const saved = safeGetStorage('sportsCardGame', {});
        const lastLogin = saved.lastLogin;
        const today = new Date().toDateString();

        if (lastLogin !== today) {
            state.coins += state.config.dailyBonus || 50;
            updateCurrencyDisplay();
            saveGameState();
            showNotification(`Daily Login Bonus: +${state.config.dailyBonus || 50} Coins! 🎁`);
        }
    } catch (error) {
        handleError(error, 'checkDailyBonus');
    }
}

function updateCurrencyDisplay() {
    if (elements.coinDisplay) {
        elements.coinDisplay.textContent = state.coins;
        elements.coinDisplay.setAttribute('aria-label', `${state.coins} coins`);
    }
}

function updateDashboardStats() {
    try {
        const totalCards = state.userInventory.length;
        const uniqueTeams = new Set(state.userInventory.map(c => c.team)).size;
        const totalPossibleCards = state.teamsData.length * (state.config.cardsPerTeam || 300);
        const completionRate = totalPossibleCards > 0
            ? ((totalCards / totalPossibleCards) * 100).toFixed(1)
            : 0;

        const totalCardsEl = document.getElementById('total-cards');
        const uniqueTeamsEl = document.getElementById('unique-teams');
        const completionRateEl = document.getElementById('completion-rate');

        if (totalCardsEl) totalCardsEl.textContent = totalCards;
        if (uniqueTeamsEl) uniqueTeamsEl.textContent = uniqueTeams;
        if (completionRateEl) completionRateEl.textContent = completionRate + '%';

        // Update team tiles
        state.teamsData.forEach(team => {
            const teamCards = state.userInventory.filter(c => c.team === team.name).length;
            const tiles = document.querySelectorAll(`.team-tile[data-team="${team.name}"]`);
            tiles.forEach(tile => {
                const progressText = tile.querySelector('.tile-progress');
                const progressBar = tile.querySelector('.progress-bar');
                if (progressText) {
                    progressText.textContent = `${teamCards} / ${state.config.cardsPerTeam || 300} Cards`;
                }
                if (progressBar) {
                    const percentage = ((teamCards / (state.config.cardsPerTeam || 300)) * 100);
                    progressBar.style.width = percentage + '%';
                    progressBar.setAttribute('aria-valuenow', percentage);
                }
            });
        });
    } catch (error) {
        handleError(error, 'updateDashboardStats');
    }
}

// ============================================================
// NOTIFICATION SYSTEM
// ============================================================
function showNotification(message, type = 'info') {
    // Simple alert for now - could be enhanced with a toast system
    alert(message);
}

// ============================================================
// TEAM LOGOS SIDEBAR
// ============================================================
function populateTeamLogos(sportFilter = 'all') {
    if (!elements.logoList) return;

    elements.logoList.innerHTML = '';

    const filteredTeams = sportFilter === 'all'
        ? state.teamsData
        : state.teamsData.filter(team => team.league === sportFilter);

    filteredTeams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'logo-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Select ${team.name}`);
        card.innerHTML = `
            <div class="logo-img">${team.icon}</div>
            <div class="logo-name">${team.name}</div>
        `;

        const selectTeam = () => {
            loadGrid(team.name, team.league, team.scheme, card);
        };

        card.onclick = selectTeam;
        card.onkeypress = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectTeam();
            }
        };

        elements.logoList.appendChild(card);
    });
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function attachEventListeners() {
    // Sport filter buttons
    document.querySelectorAll('.sport-button').forEach(button => {
        const handleClick = () => {
            const sport = button.dataset.sport;
            state.currentSportFilter = sport;

            document.querySelectorAll('.sport-button').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            document.querySelectorAll('.team-tile').forEach(tile => {
                if (sport === 'all' || tile.dataset.league === sport) {
                    tile.style.display = 'block';
                } else {
                    tile.style.display = 'none';
                }
            });
        };

        button.onclick = handleClick;
        button.onkeypress = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
            }
        };
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    });

    // Dashboard team tiles
    document.querySelectorAll('.team-tile').forEach(tile => {
        const handleClick = () => {
            const teamName = tile.dataset.team;
            const leagueName = tile.dataset.league;
            const scheme = tile.dataset.scheme;

            state.currentSportFilter = leagueName;

            loadGrid(teamName, leagueName, scheme, null);
            populateTeamLogos(state.currentSportFilter);
            elements.dashboardPage.style.display = 'none';
            elements.appPage.style.display = 'flex';
        };

        tile.onclick = handleClick;
        tile.onkeypress = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
            }
        };
    });

    // Back to dashboard
    if (elements.backToDashboard) {
        elements.backToDashboard.onclick = () => {
            elements.appPage.style.display = 'none';
            elements.dashboardPage.style.display = 'flex';
            updateDashboardStats();
        };
    }

    // Store buttons
    const openStore = () => {
        elements.storeModal.style.display = 'flex';
        elements.storeModal.setAttribute('aria-hidden', 'false');
        const closeButton = elements.storeModal.querySelector('#close-store');
        if (closeButton) closeButton.focus();
    };

    if (elements.storeButton) {
        elements.storeButton.onclick = openStore;
    }

    if (elements.storeButtonAlbum) {
        elements.storeButtonAlbum.onclick = openStore;
    }

    if (elements.closeStore) {
        elements.closeStore.onclick = () => {
            elements.storeModal.style.display = 'none';
            elements.storeModal.setAttribute('aria-hidden', 'true');
        };
    }

    if (elements.buyStandardPack) {
        elements.buyStandardPack.onclick = () => {
            const packPrice = state.config.standardPackPrice || 100;
            if (state.coins >= packPrice) {
                state.coins -= packPrice;
                updateCurrencyDisplay();
                saveGameState();
                elements.storeModal.style.display = 'none';
                openPack();
            } else {
                showNotification(`Not enough coins! You need ${packPrice} coins.`, 'error');
            }
        };
    }

    // Promo code redemption
    const redeemButton = document.getElementById('redeem-code-button');
    const promoInput = document.getElementById('promo-code-input');

    if (redeemButton && promoInput) {
        redeemButton.onclick = redeemPromoCode;

        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                redeemPromoCode();
            }
        });
    }

    // Search and filter with debouncing
    if (elements.searchInput) {
        const debouncedFilter = debounce(() => {
            filterGrid(elements.searchInput.value);
        }, 300);

        elements.searchInput.addEventListener('input', debouncedFilter);
    }

    if (elements.filterSelect) {
        elements.filterSelect.addEventListener('change', () => {
            filterGrid(elements.searchInput ? elements.searchInput.value : '');
        });
    }

    // Keyboard navigation for drag and drop
    document.addEventListener('keydown', handleKeyboardNavigation);

    // User strip drag/drop listeners
    if (elements.userStrip) {
        elements.userStrip.addEventListener('dragover', handleDragOver);
        elements.userStrip.addEventListener('drop', handleDrop);
        elements.userStrip.addEventListener('dragenter', handleDragEnter);
        elements.userStrip.addEventListener('dragleave', handleDragLeave);
    }
}

// ============================================================
// KEYBOARD NAVIGATION (ACCESSIBILITY)
// ============================================================
let selectedCard = null;
let keyboardMode = false;

function handleKeyboardNavigation(e) {
    if (!keyboardMode && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        keyboardMode = true;
    }

    if (!keyboardMode) return;

    // Handle card selection with Enter/Space
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.classList.contains('user-card')) {
        e.preventDefault();
        selectedCard = document.activeElement;
        selectedCard.classList.add('selected');
        showNotification('Card selected. Use arrow keys to navigate, Enter to place.', 'info');
    }

    // Handle escape to cancel
    if (e.key === 'Escape' && selectedCard) {
        selectedCard.classList.remove('selected');
        selectedCard = null;
    }
}

// ============================================================
// PROMO CODE SYSTEM
// ============================================================
function redeemPromoCode() {
    const input = document.getElementById('promo-code-input');
    const messageDiv = document.getElementById('promo-message');

    if (!input || !messageDiv) return;

    const code = input.value.trim().toUpperCase();

    messageDiv.innerHTML = '';

    if (!code) {
        messageDiv.innerHTML = '<span style="color: #FF6B6B;">Please enter a code</span>';
        return;
    }

    if (!state.promoCodes[code]) {
        messageDiv.innerHTML = '<span style="color: #FF6B6B;">❌ Invalid code. Please check and try again.</span>';
        return;
    }

    if (state.redeemedCodes.includes(code)) {
        messageDiv.innerHTML = '<span style="color: #FFA500;">⚠️ This code has already been redeemed!</span>';
        return;
    }

    const promoData = state.promoCodes[code];
    state.redeemedCodes.push(code);
    saveGameState();

    messageDiv.innerHTML = `<span style="color: #4ECB71;">✓ Code redeemed! Opening ${promoData.sponsor} pack...</span>';

    input.value = '';

    setTimeout(() => {
        elements.storeModal.style.display = 'none';
        openPromoPack(promoData);
    }, 1500);
}

// ============================================================
// PACK OPENING SYSTEM
// ============================================================
function openPack() {
    const cards = generatePackCards();
    state.userInventory.push(...cards);
    saveGameState();

    showPackAnimation(cards);
}

function openPromoPack(promoData) {
    const cards = generatePackCards(promoData.cardCount, promoData.league, promoData.guaranteed);
    state.userInventory.push(...cards);
    saveGameState();

    showPackAnimation(cards, promoData);
}

function generatePackCards(count = 5, league = 'all', guaranteedRarity = null) {
    const pack = [];

    let availableTeams = state.teamsData;
    if (league !== 'all') {
        availableTeams = state.teamsData.filter(t => t.league === league);
    }

    if (availableTeams.length === 0) {
        handleError(new Error('No teams available for pack generation'), 'generatePackCards');
        return pack;
    }

    for (let i = 0; i < count; i++) {
        let rarity;

        if (i === count - 1 && guaranteedRarity) {
            const roll = Math.random() * 100;
            if (guaranteedRarity === 'rare') {
                if (roll < 70) rarity = 'rare';
                else if (roll < 95) rarity = 'epic';
                else rarity = 'legendary';
            } else {
                rarity = guaranteedRarity;
            }
        } else {
            rarity = determineRarity();
        }

        const team = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        const cardNumber = Math.floor(Math.random() * (state.config.cardsPerTeam || 300)) + 1;

        const card = {
            id: 'card-' + state.cardIdCounter++,
            team: team.name,
            league: team.league,
            number: cardNumber,
            rarity: rarity,
            playerName: generatePlayerName()
        };

        pack.push(card);
    }

    return pack;
}

function determineRarity() {
    const roll = Math.random() * 100;
    const odds = state.config.rarityOdds || { common: 70, rare: 20, epic: 8, legendary: 2 };

    if (roll < odds.common) return 'common';
    if (roll < odds.common + odds.rare) return 'rare';
    if (roll < odds.common + odds.rare + odds.epic) return 'epic';
    return 'legendary';
}

function generatePlayerName() {
    const firstNames = state.playerNames.firstNames || ['Player'];
    const lastNames = state.playerNames.lastNames || ['Name'];

    return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' +
           lastNames[Math.floor(Math.random() * lastNames.length)];
}

function showPackAnimation(cards, promoData = null) {
    if (!elements.packOpeningModal) return;

    elements.packOpeningModal.style.display = 'flex';
    elements.packOpeningModal.setAttribute('aria-hidden', 'false');
    let currentIndex = 0;

    function showNextCard() {
        if (currentIndex >= cards.length) {
            elements.packOpeningModal.style.display = 'none';
            elements.packOpeningModal.setAttribute('aria-hidden', 'true');
            refreshUserCards();
            updateDashboardStats();
            return;
        }

        const card = cards[currentIndex];
        const rarityColors = {
            common: '#9E9E9E',
            rare: '#4A90E2',
            epic: '#9B59B6',
            legendary: '#FFD700'
        };

        let sponsorHeader = '';
        if (promoData) {
            sponsorHeader = `
                <div class="sponsor-header" style="background: ${promoData.color};">
                    🎁 ${promoData.sponsor} - ${promoData.description}
                </div>
            `;
        }

        elements.packOpeningModal.innerHTML = `
            ${sponsorHeader}
            <div class="pack-card-reveal" style="--rarity-color: ${rarityColors[card.rarity]}" role="dialog" aria-label="Card reveal">
                <div class="card-rarity-badge" style="background: ${rarityColors[card.rarity]}">
                    ${card.rarity.toUpperCase()}
                </div>
                <div class="card-reveal-name">${card.playerName}</div>
                <div class="card-reveal-team">${card.team}</div>
                <div class="card-reveal-number">#${card.number}</div>
                <div style="margin-top: 20px; color: var(--text-muted);">
                    Card ${currentIndex + 1} of ${cards.length}
                </div>
            </div>
            <button class="continue-button" id="next-card-button" aria-label="${currentIndex < cards.length - 1 ? 'Show next card' : 'Finish opening pack'}">
                ${currentIndex < cards.length - 1 ? 'NEXT CARD' : 'FINISH'}
            </button>
        `;

        const nextButton = document.getElementById('next-card-button');
        if (nextButton) {
            nextButton.onclick = () => {
                currentIndex++;
                showNextCard();
            };
            nextButton.focus();
        }
    }

    showNextCard();
}

function refreshUserCards() {
    if (!elements.userStrip) return;

    elements.userStrip.innerHTML = '';

    state.userInventory.forEach(card => {
        const cardEl = createCardElement(card);
        elements.userStrip.appendChild(cardEl);
    });

    attachDragListeners();
}

function createCardElement(card) {
    const rarityColors = {
        common: '#9E9E9E',
        rare: '#4A90E2',
        epic: '#9B59B6',
        legendary: '#FFD700'
    };

    const cardEl = document.createElement('div');
    cardEl.className = 'user-card';
    cardEl.id = card.id;
    cardEl.dataset.cardName = card.playerName;
    cardEl.dataset.cardNumber = card.number;
    cardEl.dataset.cardTeam = card.team;
    cardEl.dataset.rarity = card.rarity;
    cardEl.style.setProperty('--rarity-color', rarityColors[card.rarity]);
    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('tabindex', '0');
    cardEl.setAttribute('aria-label', `${card.playerName}, ${card.team}, number ${card.number}, ${card.rarity} rarity`);

    cardEl.innerHTML = `
        <div class="card-rarity" style="background: ${rarityColors[card.rarity]}" aria-hidden="true"></div>
        <div class="card-name">${card.playerName}</div>
        <div class="card-details">${card.team} • ${card.league}</div>
        <div class="card-number">#${card.number}</div>
    `;

    return cardEl;
}

// ============================================================
// GRID & COLLECTION
// ============================================================
function loadGrid(teamName, leagueName, schemeClass, clickedElement) {
    if (!elements.theGrid || !elements.currentLeagueHeader) return;

    elements.theGrid.innerHTML = '';
    elements.currentLeagueHeader.textContent = `League: ${leagueName} | Team: ${teamName}`;
    state.currentTeamKey = teamName.replace(/\s/g, '');
    state.currentTeam = teamName;

    applyScheme(schemeClass);

    document.querySelectorAll('.logo-card').forEach(card => {
        card.classList.remove('active');
        card.setAttribute('aria-current', 'false');
    });
    if (clickedElement) {
        clickedElement.classList.add('active');
        clickedElement.setAttribute('aria-current', 'true');
    }

    const cardsPerTeam = state.config.cardsPerTeam || 300;
    for (let i = 1; i <= cardsPerTeam; i++) {
        const card = document.createElement('div');
        card.className = 'grid-card';
        card.id = `grid-slot-${i}`;
        card.setAttribute('role', 'region');
        card.setAttribute('aria-label', `Slot ${i} for ${teamName}`);

        const placeholder = document.createElement('span');
        placeholder.className = 'grid-placeholder';
        placeholder.textContent = `${teamName}\nCard ${i}`;
        placeholder.setAttribute('aria-hidden', 'true');
        card.appendChild(placeholder);

        card.dataset.slot = i;
        card.dataset.team = teamName;
        card.dataset.league = leagueName;

        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);

        elements.theGrid.appendChild(card);
    }

    refreshUserCards();
    loadSavedState();
}

function applyScheme(schemeClass) {
    if (!elements.pageContainer) return;

    elements.pageContainer.classList.remove('scheme-cosmos', 'scheme-aqua', 'scheme-dark', 'scheme-solar', 'scheme-thunder');
    if (schemeClass) {
        elements.pageContainer.classList.add(schemeClass);
    }
}

function loadSavedState() {
    const savedState = safeGetStorage('albumState_' + state.currentTeamKey, {});

    document.querySelectorAll('.user-card').forEach(card => {
        if (elements.userStrip) {
            elements.userStrip.appendChild(card);
        }
    });

    for (const [cardId, slotId] of Object.entries(savedState)) {
        const card = document.getElementById(cardId);
        const slot = document.getElementById(slotId);

        if (card && slot) {
            slot.appendChild(card);
        } else if (card && elements.userStrip) {
            elements.userStrip.appendChild(card);
        }
    }

    attachDragListeners();
    filterGrid(elements.searchInput ? elements.searchInput.value : '');
}

function saveAlbumState() {
    if (!elements.theGrid) return;

    const stateObj = {};

    elements.theGrid.querySelectorAll('.grid-card').forEach(slot => {
        const userCard = slot.querySelector('.user-card');
        if (userCard) {
            stateObj[userCard.id] = slot.id;
        }
    });

    safeSetStorage('albumState_' + state.currentTeamKey, stateObj);
}

function filterGrid(searchTerm) {
    if (!elements.theGrid || !elements.userStrip) return;

    const filterValue = elements.filterSelect ? elements.filterSelect.value : 'all';
    const searchLower = searchTerm.toLowerCase();

    const gridCards = elements.theGrid.querySelectorAll('.grid-card');
    gridCards.forEach(card => {
        const userCard = card.querySelector('.user-card');
        const hasCard = !!userCard;
        let show = true;

        let cardText = card.textContent.toLowerCase();
        if (userCard && userCard.dataset.cardName) {
            cardText = userCard.dataset.cardName.toLowerCase();
        }

        if (searchTerm && !cardText.includes(searchLower)) {
            show = false;
        }

        if (show && filterValue === 'placed') {
            if (!hasCard) show = false;
        } else if (show && filterValue === 'empty') {
            if (hasCard) show = false;
        }

        card.style.display = show ? 'flex' : 'none';
    });

    const userCards = elements.userStrip.querySelectorAll('.user-card');
    userCards.forEach(card => {
        const cardName = card.dataset.cardName.toLowerCase();

        if (searchTerm && !cardName.includes(searchLower)) {
            card.classList.add('hidden');
        } else {
            card.classList.remove('hidden');
        }
    });
}

// ============================================================
// DRAG & DROP WITH TEAM VALIDATION
// ============================================================

/**
 * Check if a card can be placed in a slot
 * NOW WITH TEAM VALIDATION!
 */
function canPlaceCardInSlot(card, slot) {
    if (slot.id === 'user-cards') {
        return true;
    }

    if (slot.classList.contains('grid-card')) {
        const cardNumber = parseInt(card.dataset.cardNumber);
        const slotNumber = parseInt(slot.dataset.slot);
        const cardTeam = card.dataset.cardTeam;
        const slotTeam = slot.dataset.team;

        // CRITICAL FIX: Validate both number AND team
        return cardNumber === slotNumber && cardTeam === slotTeam;
    }

    return false;
}

/**
 * Highlight matching slots when dragging a card (VISUAL INDICATOR)
 */
function highlightMatchingSlots(card) {
    if (!card || !elements.theGrid) return;

    const cardNumber = parseInt(card.dataset.cardNumber);
    const cardTeam = card.dataset.cardTeam;

    elements.theGrid.querySelectorAll('.grid-card').forEach(slot => {
        const slotNumber = parseInt(slot.dataset.slot);
        const slotTeam = slot.dataset.team;
        const hasUserCard = slot.querySelector('.user-card');

        if (slotNumber === cardNumber && slotTeam === cardTeam && !hasUserCard) {
            slot.classList.add('matching-slot');
        }
    });
}

/**
 * Clear highlighted slots
 */
function clearMatchingSlots() {
    if (!elements.theGrid) return;

    elements.theGrid.querySelectorAll('.grid-card').forEach(slot => {
        slot.classList.remove('matching-slot');
    });
}

function attachDragListeners() {
    document.querySelectorAll('.user-card').forEach(card => {
        card.draggable = true;
        card.removeEventListener('dragstart', handleDragStart);
        card.removeEventListener('dragend', handleDragEnd);
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    state.draggedCardElement = e.target;
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');

    // VISUAL INDICATOR: Highlight matching slots
    highlightMatchingSlots(e.target);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');

    // Clear visual indicators
    clearMatchingSlots();
}

function handleDragEnter(e) {
    const card = state.draggedCardElement;
    const target = e.currentTarget;
    const hasUserCard = target.querySelector && target.querySelector('.user-card');

    const isEmptySlot = (target.id === 'user-cards' || (target.classList.contains('grid-card') && !hasUserCard));
    const matchesNumber = card ? canPlaceCardInSlot(card, target) : false;

    if (isEmptySlot && matchesNumber) {
        target.classList.add('active-drop-target');
        e.preventDefault();
    } else if (isEmptySlot && !matchesNumber && target.classList.contains('grid-card')) {
        target.classList.add('invalid-drop-target');
    }
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('active-drop-target');
    e.currentTarget.classList.remove('invalid-drop-target');
}

function handleDragOver(e) {
    const card = state.draggedCardElement;
    const target = e.currentTarget;
    const hasUserCard = target.querySelector && target.querySelector('.user-card');

    const isEmptySlot = (target.id === 'user-cards' || (target.classList.contains('grid-card') && !hasUserCard));
    const matchesNumber = card ? canPlaceCardInSlot(card, target) : false;

    if (isEmptySlot && matchesNumber) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    } else {
        e.dataTransfer.dropEffect = 'none';
    }
}

function handleDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const card = document.getElementById(draggedId);
    const target = e.currentTarget;

    if (card) {
        card.classList.remove('dragging');
    }

    target.classList.remove('active-drop-target');
    target.classList.remove('invalid-drop-target');

    if (card) {
        const isGridSlot = target.classList.contains('grid-card');
        const hasUserCard = target.querySelector('.user-card');

        if (!canPlaceCardInSlot(card, target)) {
            const cardNumber = card.dataset.cardNumber;
            const cardTeam = card.dataset.cardTeam;
            const slotTeam = target.dataset.team;
            const slotNumber = target.dataset.slot;

            if (cardTeam !== slotTeam) {
                showNotification(`Cannot place ${cardTeam} card in ${slotTeam} slot!`, 'error');
            } else if (cardNumber !== slotNumber) {
                showNotification(`Card #${cardNumber} must go in slot #${slotNumber}!`, 'error');
            }
            return;
        }

        if (isGridSlot && !hasUserCard) {
            target.appendChild(card);
            saveAlbumState();
        } else if (target.id === 'user-cards') {
            target.appendChild(card);
            saveAlbumState();
        }

        filterGrid(elements.searchInput ? elements.searchInput.value : '');
    }

    clearMatchingSlots();
}

// ============================================================
// START THE APP
// ============================================================
document.addEventListener('DOMContentLoaded', init);
