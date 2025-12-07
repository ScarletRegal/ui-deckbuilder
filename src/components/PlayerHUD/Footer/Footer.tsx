import styles from './Footer.module.css';

interface FooterProps {
    onEndTurnClick: () => void;
    onDeckClick?: () => void;
    isTurnDisabled: boolean;
    isDeckDisabled: boolean;
    playerFocus: number;
    maxFocus: number;
}

export function Footer({ onEndTurnClick, onDeckClick, isTurnDisabled, isDeckDisabled, playerFocus, maxFocus }: FooterProps) {

    const focusDots = [];
    for (let i = 0; i < maxFocus; i++) {
        focusDots.push(
            <div
                key={i}
                className={`${styles.focusDot} ${i < playerFocus ? styles.active : ''}`}
            />
        );
    }

    return (
        <footer className={styles.footerArea}>
            <button
                className={styles.deckButton}
                onClick={onDeckClick}
                disabled={isDeckDisabled}
            >
                <span className="icon">playing_cards</span>
            </button>

            <div className={styles.focusDisplay}>
                {focusDots}
            </div>

            <button
                className={styles.endTurnButton}
                onClick={onEndTurnClick}
                disabled={isTurnDisabled}
            >
                <span className="icon">hourglass_bottom</span>
            </button>
        </footer>
    );
}