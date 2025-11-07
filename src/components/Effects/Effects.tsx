// src/components/PlayerEffects/PlayerEffects.tsx
import React from 'react';
import styles from './Effects.module.css';

interface EffectsProps {
    paletteName: string;
    fontFamily: string;
    activeColor: string | null;
}

// Define our effect types
type Effect = {
    id: string;
    label: string;
    description: string;
    render: () => React.ReactNode;
};

export function Effects({
    paletteName,
    fontFamily,
    activeColor
}: EffectsProps) {

    const effects: Effect[] = [];

    // --- 1. Persistent: Current Palette ---
    effects.push({
        id: 'palette',
        label: 'Palette',
        description: `Your active palette is "${paletteName}". This will be used for generated colors.`,
        render: () => <span className="icon">palette</span>,
    });

    // --- 2. Persistent: Current Font Family ---
    effects.push({
        id: 'font',
        label: 'Font',
        description: `Your active font is "${fontFamily}". This will be used for new text elements.`,
        render: () => <span className="icon">text_fields</span>,
    });

    // --- 3. Conditional: Active Color ---
    if (activeColor) {
        effects.push({
            id: 'activeColor',
            label: 'Color',
            description: `You have "${activeColor}" selected. Playing this on an element will apply it and consume the effect.`,
            render: () => (
                // Render a color swatch
                <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: activeColor }}
                />
            ),
        });
    }

    // Simple click handler to show description
    const handleEffectClick = (description: string) => {
        alert(description);
        // In the future, this could open a custom modal
    };

    return (
        <div className={styles.effectsContainer}>
            {effects.map(effect => (
                <div
                    key={effect.id}
                    className={styles.effectIcon}
                    onClick={() => handleEffectClick(effect.description)}
                    title={effect.label} // Tooltip for desktop
                >
                    {effect.render()}
                </div>
            ))}
        </div>
    );
}