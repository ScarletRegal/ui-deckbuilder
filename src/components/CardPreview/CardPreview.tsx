import React from 'react';
import { type Card as CardType } from '../../types/card.types';
import styles from './CardPreview.module.css';

interface CardPreviewProps {
    card: CardType;
    isPlayable: boolean;
    onClose: () => void;
    onPlay: (card: CardType) => void;
}

export function CardPreview({ card, isPlayable, onClose, onPlay }: CardPreviewProps) {

    // This function handles the "Play" button click
    const handlePlayClick = () => {
        if (isPlayable) {
            onPlay(card);
        }
    };

    return (
        // The backdrop that, when clicked, closes the preview
        <div className={styles.backdrop} onClick={onClose}>

            {/* The large card. We use onClick(e.stopPropagation) to prevent backdrop click */}
            <div className={styles.largeCard} onClick={(e) => e.stopPropagation()}>

                {/* Card Content (styled to be larger) */}
                <div className={styles.header}>
                    <span className={styles.focusCost}>{card.focusCost}</span>
                </div>
                <strong className={styles.name}>{card.name}</strong>
                <p className={styles.description}>{card.description}</p>
                <span className={styles.category}>{card.mainCategory}</span>

                {/* Play Button */}
                <button
                    className={styles.playButton}
                    disabled={!isPlayable}
                    onClick={handlePlayClick}
                >
                    Play
                </button>
            </div>

        </div>
    );
}