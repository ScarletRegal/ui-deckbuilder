import type { GameState, PlayerState } from '../types/game.types';
import type { Card, CardEffect } from '../types/card.types';
import { encounterLibrary } from './encounterLibrary';
import { paletteLibrary } from './paletteLibrary';
import { v4 as uuidv4 } from 'uuid';
import { cardLibrary } from './cardLibrary';
import { type GradeResult } from './gradingAgent';
import { initialState } from './initialState';

interface ScriptStep {
    ids: string[];
    message: string;
}

// --- TUTORIAL SCRIPT ---
// Maps the Turn Index (0-based) to an array of specific Card IDs to draw.
// This ensures the player learns mechanics in a specific order.
const TUTORIAL_SCRIPT: Record<number, ScriptStep> = {
    0: {
        ids: ['c118'],
        message: "Welcome, Designer! \n\nIn this game, you use cards to edit the design. Play a color card to load your brush. \n\nWhen you are out of cards or Focus, press the Hourglass button to End Turn and draw a fresh hand."
    },
    1: {
        ids: ['c302'],
        message: "Great! You have a color loaded (check the buffs above your deck). \n\nNow, play 'Solid Fill' to apply that color to the component. \n\nYou'll notice a number on the card generated. That is its Focus (Energy) cost. You have limited Focus per turn, so manage it wisely!"
    },
    2: {
        ids: ['c006'],
        message: "Text is always important for context in a design. \n\nPlay 'Generate Text Style' to add a random text style to your hand."
    },
    3: {
        ids: ['c301'],
        message: "Shapes define the dimensions and borders. \n\nPlay 'Rectangle'. The default state of a component is usually Row, so notice the shape the component takes!"
    },
};

// --- HELPER FUNCTIONS ---

export function dismissTutorialMessage(currentState: GameState): GameState {
    return {
        ...currentState,
        tutorialMessage: null
    };
}

export function showCurrentTutorialMessage(currentState: GameState): GameState {
    // Only applies to tutorial
    if (currentState.currentEncounter?.id !== 'e_tutorial') return currentState;

    const currentTurnIndex = currentState.maxTurns - currentState.turnsRemaining;
    const step = TUTORIAL_SCRIPT[currentTurnIndex];

    if (step) {
        return {
            ...currentState,
            tutorialMessage: step.message
        };
    }
    return currentState;
}

function shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const getCardTemplate = (function () {
    const libraryMap = new Map(cardLibrary.map(card => [card.id, card]));
    return function (id: string): Card | undefined {
        return libraryMap.get(id);
    };
})();

/**
 * Draws cards from the deck. Automatically reshuffles discard into deck if deck runs out.
 */
function drawCards(player: PlayerState, amount: number) {
    let cardsDrawn = 0;
    while (cardsDrawn < amount) {
        // Refill deck from discard if empty
        if (player.deck.length === 0) {
            if (player.discard.length === 0) {
                break; // No cards left in deck OR discard
            }
            // Reshuffle discard into deck
            player.deck = shuffle([...player.discard]);
            player.discard = [];
        }

        const card = player.deck.pop();
        if (card) {
            player.hand.push(card);
            cardsDrawn++;
        }
    }
}

/**
 * Handles end-of-turn cleanup and starting the new turn.
 * Supports Tutorial Script overrides.
 */
function startTurnLogic(
    player: PlayerState,
    encounterId: string | undefined,
    turnIndex: number
): void {
    player.focus = player.maxFocus;
    player.discard = [...player.discard, ...player.hand];
    player.hand = [];

    if (encounterId === 'e_tutorial') {
        const step = TUTORIAL_SCRIPT[turnIndex];

        if (step) {
            // Scripted Turn: Generate specific cards
            step.ids.forEach(id => {
                const template = getCardTemplate(id);
                if (template) {
                    player.hand.push({ ...template, id: uuidv4() });
                }
            });
            return;
        }
    }

    drawCards(player, 5);
}

// --- EXPORTED FUNCTIONS ---

export function startEncounter(currentState: GameState, encounterIndex: number): GameState {
    const encounter = encounterLibrary[encounterIndex];

    if (!encounter) {
        let winState = JSON.parse(JSON.stringify(currentState));
        winState.phase = "runOver";
        winState.currentEncounter = { id: 'win', promptName: 'You Win!', defaultText: 'Game Complete', maxTurns: 0 };
        return winState;
    }

    let newState = JSON.parse(JSON.stringify(currentState));

    // --- 1. Deck Setup ---
    if (encounterIndex === 0) {
        // New Game (Tutorial): Load fresh starter deck
        newState.player.deck = initialState.player.deck.map(card => ({ ...card, id: uuidv4() }));
    } else if (encounterIndex === 1) {
        // --- SPECIAL CASE: Post-Tutorial Transition ---
        if (currentState.encounterIndex === 0 && currentState.phase !== 'reward') {
            // This handles "Skip Tutorial" case where deck might be stale
            // But generally, newState.player.deck here is correct.
        }

    } else {
        // Normal Game: Merge everything back into the deck

        const allCards = [
            ...newState.player.deck,
            ...newState.player.hand,
            ...newState.player.discard,
            ...newState.player.exhausted
        ];

        newState.player.deck = allCards.filter(card => !card.isTemporary);
    }
    // ----------------------------

    newState.currentEncounter = encounter;
    newState.encounterIndex = encounterIndex;
    newState.turnsRemaining = encounter.maxTurns;
    newState.maxTurns = encounter.maxTurns;
    newState.phase = 'playerTurn';
    newState.tutorialMessage = null;

    newState.player.hand = [];
    newState.player.discard = [];
    newState.player.exhausted = [];
    newState.player.canvas = JSON.parse(JSON.stringify(initialState.player.canvas));

    shuffle(newState.player.deck);

    startTurnLogic(newState.player, encounter.id, 0);

    if (encounter.id === 'e_tutorial' && TUTORIAL_SCRIPT[0]) {
        newState.tutorialMessage = TUTORIAL_SCRIPT[0].message;
    }

    return newState;
}

export function endTurn(currentState: GameState): GameState {
    const newState = JSON.parse(JSON.stringify(currentState));

    newState.turnsRemaining--;

    if (newState.turnsRemaining <= 0) {
        newState.phase = 'results';
        // Clean up hand
        newState.player.discard = [...newState.player.discard, ...newState.player.hand];
        newState.player.hand = [];
        return newState;
    }

    // Calculate current turn index for tutorial script logic
    const currentTurnIndex = newState.maxTurns - newState.turnsRemaining;

    startTurnLogic(
        newState.player,
        newState.currentEncounter?.id,
        currentTurnIndex
    );

    if (newState.currentEncounter?.id === 'e_tutorial') {
        const step = TUTORIAL_SCRIPT[currentTurnIndex];
        if (step) {
            newState.tutorialMessage = step.message;
        }
    }

    return newState;
}

/**
 * Generates 3 random cards from the library that are NOT in the current deck.
 */
function getRewardCards(state: GameState): Card[] {
    // Identify cards currently in the deck to avoid offering duplicates of what they have
    // (Using name or base ID to identify 'copies')
    const currentDeckIds = new Set(state.player.deck.map(c => {
        // We try to find the original library ID.
        // Since card instances have UUIDs, we match via card properties or helper lookup if we stored origin ID.
        // For this prototype, filtering by name is a safe approximation.
        return c.name;
    }));

    const rewardPool = cardLibrary.filter(card => !currentDeckIds.has(card.name));

    shuffle(rewardPool);

    // Return top 3
    return rewardPool.slice(0, 3).map(card => ({ ...card, id: uuidv4() }));
}

export function processGradingResult(currentState: GameState, result: GradeResult): GameState {
    const newState = JSON.parse(JSON.stringify(currentState));

    if (newState.currentEncounter) {
        (newState.currentEncounter as any).feedback = result.feedback;
    }

    if (result.pass) {
        newState.phase = 'reward';

        if (newState.currentEncounter?.id === 'e_tutorial') {
            // If passing the tutorial, force the reward to be the Icon card
            const iconCard = cardLibrary.find(c => c.id === 'c203');

            if (iconCard) {
                // Create a new unique instance of the icon card
                newState.rewardCards = [{ ...iconCard, id: uuidv4() }];
            } else {
                // Fallback: If card not found, give random rewards
                newState.rewardCards = getRewardCards(newState);
            }
        } else {
            // Standard behavior: Get 3 random rewards
            newState.rewardCards = getRewardCards(newState);
        }

    } else {
        newState.phase = 'runOver';
    }
    return newState;
}

export function selectRewards(currentState: GameState, chosenCards: Card[]): GameState {
    const newState = JSON.parse(JSON.stringify(currentState));

    if (newState.currentEncounter?.id !== 'e_tutorial') {
        if (chosenCards.length > 0) {
            newState.player.deck.push(...chosenCards);
        }
    }

    newState.rewardCards = [];
    newState.encounterIndex++;
    newState.phase = 'setup';

    return newState;
}

export function playCard(state: GameState, card: Card): GameState {
    let newState = state;
    const activePlayer = newState.player;

    activePlayer.focus -= card.focusCost;

    for (const effect of card.effects) {
        newState = applyEffect(newState, effect, activePlayer);
    }

    activePlayer.hand = activePlayer.hand.filter(c => c.id !== card.id);

    if (card.exhausts) {
        activePlayer.exhausted.push(card);
    } else {
        activePlayer.discard.push(card);
    }

    return newState;
}

function applyEffect(state: GameState, effect: CardEffect, caster: PlayerState): GameState {
    switch (effect.type) {
        case "SET_CANVAS_PROP":
            // Handle 'Fill Type' logic (Solid/Opaque requires Active Color)
            if (effect.property === 'fillType' && (effect.value === 'solid' || effect.value === 'opaque')) {
                caster.canvas.fillType = effect.value;
                if (caster.canvas.activeColor) {
                    caster.canvas.backgroundColor = caster.canvas.activeColor;
                    caster.canvas.activeColor = null; // Consume Buff
                } else {
                    // Default to gray if no active color
                    if (!caster.canvas.backgroundColor || caster.canvas.backgroundColor === 'transparent') {
                        caster.canvas.backgroundColor = '#CCCCCC';
                    }
                }
            }
            // Handle 'Text Style' logic
            else if (effect.property === "activeTextStyle") {
                const style = caster.canvas.textStyles.find(ts => ts.name === effect.value.name);
                if (style) caster.canvas.activeTextStyle = style;
                else {
                    caster.canvas.textStyles.push(effect.value);
                    caster.canvas.activeTextStyle = effect.value;
                }
            }
            else {
                (caster.canvas as any)[effect.property] = effect.value;
            }
            break;

        case "DRAW_CARDS":
            drawCards(caster, effect.amount);
            break;

        case "MODIFY_FOCUS":
            caster.focus += effect.amount;
            break;

        case "GENERATE_CARD":
            const pool = effect.fromCardPool;
            const randomCardId = pool[Math.floor(Math.random() * pool.length)];
            const template = getCardTemplate(randomCardId);
            if (template) {
                caster.hand.push({ ...template, id: uuidv4() });
            }
            break;

        case "GENERATE_SET_CARDS": {
            const pool = effect.fromCardPool;

            for (let i = 0; i < pool.length; i++) {
                const card = pool[i];
                const template = getCardTemplate(card);
                if (template) {
                    caster.hand.push({ ...template, id: uuidv4() });
                }
            }
            break;
        }

        case "ADD_ICON":
            caster.canvas.icon = effect.icon;
            break;

        case "ADD_TEXT":
            // Used for hardcoded text cards
            const textStyle = caster.canvas.activeTextStyle || caster.canvas.textStyles.find(ts => ts.name === effect.styleName);
            if (textStyle) {
                caster.canvas.text = {
                    text: effect.text,
                    styleName: textStyle.name,
                    color: caster.canvas.activeColor || '#333',
                };
            }
            caster.canvas.activeColor = null; // Consume Buff
            break;

        case "APPLY_COLOR_TO":
            let activeColor = caster.canvas.activeColor;

            switch (effect.target) {
                case 'fill':
                    // Use active color, or keep existing, or default?
                    // Usually Fill is handled by SET_CANVAS_PROP 'fillType', 
                    // but this card forces a specific color application.
                    if (activeColor) caster.canvas.backgroundColor = activeColor;
                    break;

                case 'stroke':
                    // Apply 2px stroke. Use active color OR default to Black.
                    caster.canvas.strokeColor = activeColor || '#111111';
                    break;

                case 'text':
                    if (activeColor && caster.canvas.text) {
                        caster.canvas.text.color = activeColor;
                    }
                    break;

                case 'icon':
                    if (activeColor && caster.canvas.icon) {
                        caster.canvas.icon.color = activeColor;
                    }
                    break;
            }

            // Consume the buff if it was used
            if (activeColor) {
                caster.canvas.activeColor = null;
            }
            break;

        case "MODIFY_PROPERTY":
            if (effect.property === "padding") {
                caster.canvas.padding += effect.amount;
            }
            break;

        case "SET_ACTIVE_COLOR_FROM_PALETTE":
            if (caster.canvas.colors.length === 0) break;
            let selectedColor: string;
            if (effect.index === "random") {
                selectedColor = caster.canvas.colors[Math.floor(Math.random() * caster.canvas.colors.length)];
            } else {
                selectedColor = caster.canvas.colors[effect.index % caster.canvas.colors.length];
            }
            caster.canvas.activeColor = selectedColor;
            break;

        case "GENERATE_PALETTE_CARD": {
            // 1. Find current palette
            const currentPaletteId = caster.canvas.activePaletteId;
            const palette = paletteLibrary.find(p => p.id === currentPaletteId);

            if (!palette || palette.cards.length === 0) break;

            for (let i = 0; i < effect.amount; i++) {
                // 2. Pick a random card ID from the palette's list
                const randomCardId = palette.cards[Math.floor(Math.random() * palette.cards.length)];

                // 3. Fetch the actual card template
                const template = getCardTemplate(randomCardId);

                if (template) {
                    template.isTemporary = true; // Mark as temporary
                    caster.hand.push({ ...template, id: uuidv4() });
                }
            }
            break;
        }

        case "SET_PALETTE": {
            const palette = paletteLibrary.find(p => p.id === effect.paletteId);
            if (palette) {
                caster.canvas.paletteName = palette.name;
                caster.canvas.activePaletteId = palette.id;
                caster.canvas.colors = palette.colors;
            }
            break;
        }

        case "ADD_ENCOUNTER_TEXT":
            if (!state.currentEncounter || !state.currentEncounter.defaultText) break;
            if (caster.canvas.textStyles.length === 0) break;

            let addedTextStyle;
            if (caster.canvas.activeTextStyle) {
                addedTextStyle = caster.canvas.activeTextStyle;
            } else {
                addedTextStyle = caster.canvas.textStyles[Math.floor(Math.random() * caster.canvas.textStyles.length)];
            }

            caster.canvas.text = {
                text: state.currentEncounter.defaultText,
                styleName: addedTextStyle.name,
                color: caster.canvas.activeColor || '#333333'
            };
            caster.canvas.activeTextStyle = null; // Consume Buff
            caster.canvas.activeColor = null; // Consume Buff
            break;

        case "ADD_ENCOUNTER_ICON":
            if (!state.currentEncounter || !state.currentEncounter.defaultIcon) break;
            if (caster.canvas.textStyles.length === 0) break;

            caster.canvas.icon = {
                materialIconName: state.currentEncounter.defaultIcon,
                color: caster.canvas.activeColor || '#333333',
                size: 24
            };
            caster.canvas.activeColor = null; // Consume Buff
            break;
    }

    return state;
}