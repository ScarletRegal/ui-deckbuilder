import { useState } from 'react';
import { type Card as CardType } from '../../types/card.types';
import cardPreviewStyles from '../CardPreview/CardPreview.module.css';
import styles from './RewardScreen.module.css';

interface RewardScreenProps {
    rewards: CardType[];
    feedback: string;
    onProceed: (cards: CardType[]) => void; // Updated prop signature
}

export function RewardScreen({ rewards, feedback, onProceed }: RewardScreenProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelection = (cardId: string) => {
        setSelectedIds(prev => {
            if (prev.includes(cardId)) {
                return prev.filter(id => id !== cardId);
            } else {
                return [...prev, cardId];
            }
        });
    };

    const handleProceed = () => {
        // Filter the full card objects based on the selected IDs
        const selectedCards = rewards.filter(card => selectedIds.includes(card.id));
        onProceed(selectedCards);
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.content}>
                <h2 className={styles.title}>Challenge Passed!</h2>
                <p className={styles.feedback}>{feedback}</p>

                <div className={styles.instructions}>
                    Select cards to add to your deck (Optional)
                </div>

                <div className={styles.cardContainer}>
                    {rewards.map(card => {
                        const isSelected = selectedIds.includes(card.id);
                        return (
                            <div
                                key={card.id}
                                // Apply selected class if active
                                className={`${styles.rewardCardWrapper} ${isSelected ? styles.selected : ''}`}
                                onClick={() => toggleSelection(card.id)}
                            >
                                {/* Visual checkmark for selected state */}
                                {isSelected && <div className={styles.checkmark}><span className="icon">check</span></div>}

                                {/* Re-use Large Card Styles */}
                                <div className={cardPreviewStyles.largeCard}>
                                    <div className={cardPreviewStyles.header}>
                                        <span className={cardPreviewStyles.focusCost}>{card.focusCost}</span>
                                    </div>
                                    <strong className={cardPreviewStyles.name}>{card.name}</strong>
                                    <p className={cardPreviewStyles.description}>{card.description}</p>
                                    <span className={cardPreviewStyles.category}>{card.mainCategory}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Proceed Button */}
                <button className={styles.proceedButton} onClick={handleProceed}>
                    {selectedIds.length === 0 ? "Skip Rewards" : `Add ${selectedIds.length} Card${selectedIds.length > 1 ? 's' : ''}`}
                </button>
            </div>
        </div>
    );
}