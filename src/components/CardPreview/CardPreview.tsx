import { type Card as CardType } from '../../types/card.types';
import styles from './CardPreview.module.css';

interface CardPreviewProps {
    card: CardType;
    isPlayable: boolean;
    showPlayButton?: boolean; // <-- New optional prop
    onClose: () => void;
    onPlay: (card: CardType) => void;
}

export function CardPreview({
    card,
    isPlayable,
    showPlayButton = true, // Default to true
    onClose,
    onPlay
}: CardPreviewProps) {

    const handlePlayClick = () => {
        if (isPlayable) {
            onPlay(card);
        }
    };

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.largeCard} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <span className={styles.focusCost}>{card.focusCost}</span>
                </div>
                <strong className={styles.name}>{card.name}</strong>
                <p className={styles.description}>{card.description}</p>
                <span className={styles.category}>{card.mainCategory}</span>

                {/* Only show button if allowed */}
                {showPlayButton && (
                    <button
                        className={styles.playButton}
                        disabled={!isPlayable}
                        onClick={handlePlayClick}
                    >
                        Play
                    </button>
                )}
            </div>
        </div>
    );
}