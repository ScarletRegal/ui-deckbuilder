import type { Encounter } from "../types/encounter.types";


export const encounterLibrary: Encounter[] = [
    {
        id: 'e_tutorial',
        promptName: 'Tutorial: The Basics',
        defaultText: 'Welcome student, let\'s learn the basics of UI design!',
        defaultIcon: null,
        maxTurns: 4,
    },
    {
        id: 'e001_primary_button',
        promptName: 'Primary Button',
        defaultText: 'Get Started',
        defaultIcon: 'arrow_forward',
        maxTurns: 5,
    },
    {
        id: 'e002_secondary_button',
        promptName: 'Secondary Button',
        defaultText: 'Learn More',
        defaultIcon: 'read_more',
        maxTurns: 5,
    },
    {
        id: 'e003_destructive_button',
        promptName: 'Destructive Button',
        defaultText: 'Delete',
        defaultIcon: 'delete',
        maxTurns: 5,
    },
    {
        id: 'e004_search_bar',
        promptName: 'Search Bar',
        defaultText: 'Search here...',
        defaultIcon: 'search',
        maxTurns: 5,
    },
]