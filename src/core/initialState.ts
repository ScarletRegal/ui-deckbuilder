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
    'c001',          // 1x Fixed Width
    'c002',          // 1x Fixed Height
    //'c003',          // 1x Grayscale
    //'c004',          // 1x Inter
    'c005',          // 1x Generate Color
    'c006',          // 1x Generate Text Style
    'c005',          // 1x Generate Color
    'c006',          // 1x Generate Text Style
    'c101',          // 1x White
    'c101',          // 1x White
    'c105',          // 1x Black
    'c105',          // 1x Black
    'c202',          // 1x Body Text
    'c203',          // 1x Icon
    'c010',          // 1x Row
    'c011',          // 1x Column
    'c012',          // 1x Hug Contents
    'c013',          // 1x Apply to Fill
    'c014',          // 1x Apply to Stroke
    'c015',          // 1x Apply to Text
    'c016',          // 1x Apply to Icon
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
    padding: 16,
    layout: 'auto',

    paletteName: 'Grayscale',
    colors: ['#111', '#555', '#888', '#EEE', '#FFF'],
    activeColor: '#111',
    backgroundColor: null,
    strokeColor: null,

    fontFamily: 'Inter',
    textStyles: [
        { name: "Heading 1", fontSize: 32, fontWeight: 700 },
        { name: "Body Text", fontSize: 16, fontWeight: 400 }
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
    phase: 'setup',

    prompt: { componentName: "Search Bar" },
    turnsRemaining: 5,
    maxTurns: 5,

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

    // "opponent" object is removed
};