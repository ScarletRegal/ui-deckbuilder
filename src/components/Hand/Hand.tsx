import { type Card as CardType } from '../../types/card.types';
import { type GamePhase } from '../../types/game.types';
import { Card } from '../Card/Card';
import styles from './Hand.module.css';

interface HandProps {
    hand: CardType[];
    playerFocus: number;
    phase: GamePhase;
    onPreview: (card: CardType) => void;
}

export function Hand({ hand, playerFocus, phase, onPreview }: HandProps) {
    const numCards = hand.length;
    // Calculate the middle index (works for odd/even)
    const midIndex = (numCards - 1) / 2;

    return (
        <section className={styles.handContainer}>
            {hand.map((card, index) => {
                // --- Calculate Fan Transforms ---
                const rotation = (index - midIndex) * 4; // 4 degrees per card
                // Make the cards in the middle lower
                const translateY = Math.abs(index - midIndex) * 5; // 5px per card from center

                return (
                    <Card
                        key={card.id}
                        card={card}
                        isDisabled={phase !== 'playerTurn' || card.focusCost > playerFocus}
                        onPreview={onPreview}
                        rotation={rotation}
                        translateY={translateY}
                        zIndex={index} // For correct overlap
                    />
                );
            })}
        </section>
    );
}