

export interface Palette {
    id: string;
    name: string;
    cards: string[];
    colors: string[]
}

export const paletteLibrary: Palette[] = [
    {
        id: 'p_blue',
        name: 'Electric Blue',
        cards: ['c106', 'c107', 'c108'],
        colors: ['#93C5FD', '#3B82F6', '#1E40AF']
    },
    {
        id: 'p_sunset',
        name: 'Sunset Coral',
        cards: ['c109', 'c110', 'c111'],
        colors: ['#FDBA74', '#F97316', '#9A3412']
    },
    {
        id: 'p_green',
        name: 'Mint & Forest',
        cards: ['c112', 'c113', 'c114'],
        colors: ['#6EE7B7', '#10B981', '#065F46']
    },
    {
        id: 'p_purple',
        name: 'Royal Violet',
        cards: ['c115', 'c116', 'c117'],
        colors: ['#C4B5FD', '#8B5CF6', '#5B21B6']
    },
    {
        id: 'p_gray',
        name: 'Slate Monochrome',
        cards: ['c118', 'c119', 'c120'],
        colors: ['#CBD5E1', '#64748B', '#1E293B']
    },
]