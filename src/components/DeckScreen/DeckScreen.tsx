import { useState, useMemo } from 'react';
import { type Card as CardType, MainCategory } from '../../types/card.types';
import { Card } from '../Card/Card';
import styles from './DeckScreen.module.css';

interface DeckViewerProps {
    deck: CardType[];
    discard: CardType[];
    exhausted: CardType[];
    onClose: () => void;
    onPreview: (card: CardType) => void;
}

type Tab = 'deck' | 'discard' | 'exhausted';

export function DeckScreen({
    deck,
    discard,
    exhausted,
    onClose,
    onPreview
}: DeckViewerProps) {
    const [activeTab, setActiveTab] = useState<Tab>('deck');

    // Sorting Logic for Deck: Foundation -> Element -> Skill
    const sortedDeck = useMemo(() => {
        const order = {
            [MainCategory.FOUNDATION]: 1,
            [MainCategory.ELEMENT]: 2,
            [MainCategory.SKILL]: 3
        };

        return [...deck].sort((a, b) => {
            const orderA = order[a.mainCategory] || 99;
            const orderB = order[b.mainCategory] || 99;
            if (orderA !== orderB) return orderA - orderB;
            // Secondary sort by name
            return a.name.localeCompare(b.name);
        });
    }, [deck]);

    // Discard/Exhausted: Recent first (Reverse order)
    const sortedDiscard = useMemo(() => [...discard].reverse(), [discard]);
    const sortedExhausted = useMemo(() => [...exhausted].reverse(), [exhausted]);

    const getActiveList = () => {
        switch (activeTab) {
            case 'deck': return sortedDeck;
            case 'discard': return sortedDiscard;
            case 'exhausted': return sortedExhausted;
        }
    };

    const cardsToShow = getActiveList();

    return (
        <div className={styles.backdrop}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>Card Piles</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    <span className="icon">close</span>
                </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'deck' ? styles.active : ''}`}
                    onClick={() => setActiveTab('deck')}
                >
                    <span className={`icon ${styles.tabIcon}`}>style</span>
                    <span className={styles.tabLabel}>
                        Deck <span className={styles.countBadge}>{deck.length}</span>
                    </span>
                </button>

                <button
                    className={`${styles.tab} ${activeTab === 'discard' ? styles.active : ''}`}
                    onClick={() => setActiveTab('discard')}
                >
                    <span className={`icon ${styles.tabIcon}`}>cached</span>
                    <span className={styles.tabLabel}>
                        Discard <span className={styles.countBadge}>{discard.length}</span>
                    </span>
                </button>

                <button
                    className={`${styles.tab} ${activeTab === 'exhausted' ? styles.active : ''}`}
                    onClick={() => setActiveTab('exhausted')}
                >
                    <span className={`icon ${styles.tabIcon}`}>local_fire_department</span>
                    <span className={styles.tabLabel}>
                        Exhausted <span className={styles.countBadge}>{exhausted.length}</span>
                    </span>
                </button>
            </div>

            {/* Content */}
            <div className={styles.scrollArea}>
                {cardsToShow.length === 0 ? (
                    <div className={styles.emptyState}>
                        No cards in {activeTab === 'deck' ? 'draw pile' : activeTab}.
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {cardsToShow.map((card) => (
                            <div key={card.id} style={{ width: '125px', height: '175px' }}>
                                <Card
                                    card={card}
                                    isDisabled={true} // Disable drag
                                    mode="grid"       // Use grid layout (no margin)
                                    onPreview={onPreview}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}