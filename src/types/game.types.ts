import { type Card } from './card.types';
import type { Encounter } from './encounter.types';

/**
 * The text style object, which we can now re-use.
 */
export interface TextStyle {
    name: string;
    fontSize: number;
    fontWeight: number;
}

/**
 * Icon that can appear on the Canvas
 */
export interface CanvasIcon {
    materialIconName: string; // e.g., 'search', 'menu'
    color: string;
    size: number;
}

/**
 * Text that can appear on the Canvas
 */
export interface CanvasText {
    text: string;
    styleName: string; // e.g., "Heading 1", "Body Text"
    color: string;
}

/**
 * This is the "Canvas" each player is manipulating.
 * Its properties are the target of the card effects.
 * This will grow as you add more game mechanics.
 */
export interface DesignCanvas {
    // Layout properties
    widthMode: "fluid" | "fixed" | "fit";
    heightMode: "fluid" | "fixed" | "fit";
    padding: number;
    layout: "block" | "row" | "column";
    shape: "square" | "rectangle" | "rounded";
    fillType: "solid" | "opaque" | "none";
    borderRadius: number;

    // Color properties
    activePaletteId: string;
    paletteName: string;
    colors: string[];
    activeColor: string | null;
    backgroundColor: string | null;
    strokeColor: string | null;

    // Typography properties
    fontFamily: string;
    textStyles: TextStyle[];
    activeTextStyle: TextStyle | null;

    icon: CanvasIcon | null;
    text: CanvasText | null;
    stroke: string | null;

    activeElement: "fill" | "stroke" | "text" | "icon" | null;
}

/**
 * Represents a single player (either human or AI).
 */
export interface PlayerState {
    id: "player" | "opponent";
    name: string;

    // Core stats
    focus: number;
    maxFocus: number;

    // Card management
    deck: Card[];
    hand: Card[];
    discard: Card[];
    exhausted: Card[];

    // The player's design canvas
    canvas: DesignCanvas;
}

/**
 * The single source of truth for the entire game.
 * This object holds all "global" state.
 */
export type GamePhase = "home" | "tutorialChoice" | "setup" | "playerTurn" | "results" | "reward" | "runOver";

export interface GameState {
    phase: GamePhase;
    turnsRemaining: number;
    maxTurns: number;

    currentEncounter: Encounter | null;
    encounterIndex: number;

    rewardCards: Card[];

    tutorialMessage: string | null;

    player: PlayerState;
}