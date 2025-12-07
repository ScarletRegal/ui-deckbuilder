import type { CanvasIcon } from "./game.types";

// Enums for your strict categories
export enum MainCategory {
    FOUNDATION = "Foundation",
    ELEMENT = "Element",
    SKILL = "Skill",
}

export enum SubCategory {
    COLOR = "Color",
    TYPE = "Type",
    LAYOUT = "Layout",
    SHAPE = "Shape",
    RESEARCH = "Research",
}

/**
 * Defines the effect a card has.
 * This is a "discriminated union" - a common pattern for actions.
 * The 'type' string tells your game logic what to do.
 */
export type CardEffect =
    | { type: "SET_CANVAS_PROP"; property: string; value: any }
    | { type: "DRAW_CARDS"; amount: number }
    | { type: "MODIFY_FOCUS"; amount: number }
    | { type: "GENERATE_CARD"; fromCardPool: string[]; amount: number }
    | { type: "GENERATE_SET_CARDS"; fromCardPool: string[]; }
    | { type: "ADD_TEXT"; text: string; styleName: string; color: string; }
    | { type: "ADD_ICON"; icon: CanvasIcon }
    | { type: "ADD_ENCOUNTER_TEXT" }
    | { type: "ADD_ENCOUNTER_ICON" }
    | { type: "APPLY_COLOR_TO"; target: 'fill' | 'stroke' | 'text' | 'icon' }
    | { type: "MODIFY_PROPERTY"; property: "padding"; amount: number; }
    | { type: "SET_ACTIVE_COLOR_FROM_PALETTE"; index: number | "random"; }// 0 for primary, "random" for random
    | { type: "ADD_RANDOM_TEXT_STYLE"; text: string; }
    | { type: "SET_PALETTE"; paletteId: string; }
    | { type: "GENERATE_PALETTE_CARD"; amount: number; strategy: "random" | "primary" };

/**
 * The main Card interface.
 * This is the "class" for every card in your game.
 */
export interface Card {
    id: string;
    name: string;
    description: string;
    focusCost: number;

    mainCategory: MainCategory;
    subCategory: SubCategory;

    // An array of effects this card triggers when played
    effects: CardEffect[];

    exhausts?: boolean;
    isTemporary?: boolean;
}