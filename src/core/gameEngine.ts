import { type GameState, type PlayerState } from '../types/game.types';
import { type Card, type CardEffect } from '../types/card.types';
import { v4 as uuidv4 } from 'uuid';
import { cardLibrary } from './cardLibrary';
import { jsx } from 'react/jsx-runtime';


const getCardTemplate = (function () {
    const libraryMap = new Map(cardLibrary.map(card => [card.id, card]));
    return function (id: string): Card | undefined {
        return libraryMap.get(id);
    }
})();

/**
 * Plays a card from the player's hand.
 */
export function playCard(
    state: GameState,
    card: Card
): GameState {
    let newState = state; // We get the deep copy from the reducer
    const activePlayer = newState.player;

    // 1. Pay the focus cost
    activePlayer.focus -= card.focusCost;

    // 2. Apply each effect of the card
    for (const effect of card.effects) {
        newState = applyEffect(newState, effect, activePlayer); // Pass player as caster
    }

    // 3. Move card from hand to discard OR exhaust
    activePlayer.hand = activePlayer.hand.filter(c => c.id !== card.id);

    if (card.exhausts) {
        activePlayer.exhausted.push(card);
    } else {
        activePlayer.discard.push(card);
    }

    return newState;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Handles drawing cards, including reshuffling the discard pile.
 */
function drawCards(player: PlayerState, amount: number) {
    let cardsDrawn = 0;

    while (cardsDrawn < amount) {
        // 1. If deck is empty, reshuffle discard pile into deck.
        if (player.deck.length === 0) {

            // 2. If discard is also empty, stop.
            if (player.discard.length === 0) {
                break;
            }

            // 3. Reshuffle
            player.deck = shuffle([...player.discard]);
            player.discard = [];
        }

        // 4. Draw one card
        const card = player.deck.pop();
        if (card) {
            player.hand.push(card);
            cardsDrawn++;
        }
    }
}

/**
 * Applies a single card effect to the game state
 */
function applyEffect(
    state: GameState,
    effect: CardEffect,
    caster: PlayerState // All effects apply to the caster (player)
): GameState {

    switch (effect.type) {
        // "targetPlayer" is now "caster"
        case "SET_CANVAS_PROP":
            (caster.canvas as any)[effect.property] = effect.value;
            break;

        case "DRAW_CARDS":
            drawCards(caster, effect.amount);
            break;

        case "MODIFY_FOCUS": // Renamed
            caster.focus += effect.amount;
            break;

        case "GENERATE_CARD":
            // ... (This logic remains the same, adding card to caster.hand)
            for (let i = 0; i < effect.amount; i++) {
                const pool = effect.fromCardPool;
                const randomCardId = pool[Math.floor(Math.random() * pool.length)];
                const template = getCardTemplate(randomCardId);
                if (template) {
                    const newCardInstance = { ...template, id: uuidv4() };
                    caster.hand.push(newCardInstance);
                }
            }
            break;

        case "ADD_ICON":
            // Set the canvas icon directly
            caster.canvas.icon = effect.icon;
            break;

        case "ADD_TEXT":
            // Find the text style that was just applied or is active
            const textStyle = caster.canvas.activeTextStyle || caster.canvas.textStyles.find(ts => ts.name === effect.styleName);
            if (textStyle) {
                caster.canvas.text = {
                    text: effect.text,
                    styleName: textStyle.name,
                    color: caster.canvas.activeColor || '#333', // Use active color or default
                };
            } else {
                console.warn(`Text style '${effect.styleName}' not found for ADD_TEXT effect.`);
                caster.canvas.text = {
                    text: effect.text,
                    styleName: "Body Text", // Fallback
                    color: caster.canvas.activeColor || '#333',
                };
            }
            break;

        case "APPLY_COLOR_TO": {
            // 1. Check if there is an active color to apply
            const colorToApply = caster.canvas.activeColor;
            if (!colorToApply) {
                // No color buff is active, so the card does nothing
                return state;
            }

            // 2. Apply the color to the specified target
            switch (effect.target) {
                case 'fill':
                    caster.canvas.backgroundColor = colorToApply;
                    break;
                case 'stroke':
                    caster.canvas.strokeColor = colorToApply;
                    break;
                case 'text':
                    if (caster.canvas.text) {
                        caster.canvas.text.color = colorToApply;
                    }
                    break;
                case 'icon':
                    if (caster.canvas.icon) {
                        caster.canvas.icon.color = colorToApply;
                    }
                    break;
            }

            // 3. Consume the buff
            caster.canvas.activeColor = null;

            break;
        }
    }

    return state;
}

/**
 * The core logic for starting a turn:
 * Resets energy, discards hand, and draws 5 new cards.
 */
function startTurnLogic(player: PlayerState): void {
    // 1. Reset focus
    player.focus = player.maxFocus;

    // 2. Discard current hand
    player.discard = [...player.discard, ...player.hand];
    player.hand = [];

    // 3. Draw 5 new cards
    drawCards(player, 5);
}

/**
 * Shuffles decks and prepares the player for the first turn.
 */
export function startGame(initialState: GameState): GameState {
    let newState = JSON.parse(JSON.stringify(initialState));

    // Shuffle deck
    shuffle(newState.player.deck);

    // Set game to "go"
    newState.phase = 'playerTurn';

    // Prepare the player for their first turn
    startTurnLogic(newState.player);

    return newState;
}

/**
 * Ends the player's turn, ticks down the timer, and starts the next turn.
 */
export function endTurn(currentState: GameState): GameState {
    const newState = JSON.parse(JSON.stringify(currentState));

    // 1. Tick down timer
    newState.turnsRemaining--;

    // 2. Check for game over
    if (newState.turnsRemaining <= 0) {
        newState.phase = 'gameOver';
        // Clear hand on game over
        newState.player.discard = [...newState.player.discard, ...newState.player.hand];
        newState.player.hand = [];
        return newState;
    }

    // 3. If not game over, start the player's next turn
    startTurnLogic(newState.player);

    return newState;
}