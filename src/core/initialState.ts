import { type GameState, type DesignCanvas } from '../types/game.types';
import { type Card } from '../types/card.types';
import { cardLibrary } from './cardLibrary';
import { v4 as uuidv4 } from 'uuid';

// Helper to find a card template.
// (Copied from gameEngine.ts - you could move this to a shared utils.ts file)
const getCardTemplate = (function () {
    const libraryMap = new Map(cardLibrary.map(card => [card.id, card]));
    return function (id: string): Card | undefined {
        return libraryMap.get(id);
    };
})();

/**
 * Defines the card IDs for the starter deck.
 */
const STARTER_DECK_IDS: string[] = [
    'c301', // Rectangle
    'c302', // Solid Fill
    'c303', // Add Text
    'c305', // Generate Color
    'c306', // Padding
    'c307', // White
    'c308', // Black
    'c309', // Row
    'c310', // Column
    'c_p_blue', // Blue Color Palette
    'c203', // Icon
    'c322',  // Stroke
    'c317'  // Apply to Fill  
];

/**
 * Creates a new, unique deck for a player based on the starter IDs.
 */
function createPlayerDeck(): Card[] {
    return STARTER_DECK_IDS.map(id => {
        const template = getCardTemplate(id);
        if (!template) {
            throw new Error(`Starter card ID ${id} not found in card library!`);
        }
        // Create a new instance with a unique ID
        return { ...template, id: uuidv4() };
    });
}

/**
 * Creates a default, empty canvas state.
 */
const createDefaultCanvas = (): DesignCanvas => ({
    widthMode: 'fixed',
    heightMode: 'fixed',
    padding: 0,
    layout: 'block',
    shape: 'square',
    borderRadius: 0,
    fillType: 'solid',
    activePaletteId: 'p_gray',
    paletteName: 'Slate Monochrome',
    colors: ['#CBD5E1', '#64748B', '#1E293B'],
    activeColor: null,
    backgroundColor: null,
    strokeColor: null,
    fontFamily: 'Inter',
    textStyles: [
        { name: "Heading 1", fontSize: 32, fontWeight: 700 },
        { name: "Body Text", fontSize: 16, fontWeight: 400 },
        { name: "Label", fontSize: 16, fontWeight: 700 }
    ],
    activeTextStyle: null,
    text: null,
    icon: null,
    stroke: null,
    activeElement: null
});

/**
 * The single source of truth for a new game.
 */
export const initialState: GameState = {
    phase: 'home',
    turnsRemaining: 0,
    maxTurns: 0,
    currentEncounter: null,
    encounterIndex: 0,

    rewardCards: [],

    tutorialMessage: null,

    player: {
        id: 'player',
        name: 'You',
        focus: 3,
        maxFocus: 3,
        deck: createPlayerDeck(),
        hand: [],
        discard: [],
        exhausted: [],
        canvas: createDefaultCanvas(),
    },
};