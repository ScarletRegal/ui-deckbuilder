
/*
 * Defines the static data for a single UI challenge.
 */
export interface Encounter {
    id: string;
    promptName: string;
    defaultText: string;
    defaultIcon: string | null;
    maxTurns: number;

    // add win conditions later
}