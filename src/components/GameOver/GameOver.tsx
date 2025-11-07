import React from 'react';
import styles from './GameOver.module.css';

interface GameOverOverlayProps {
    onRestart: () => void;
}

export function GameOverOverlay({ onRestart }: GameOverOverlayProps) {
    return (
        <div className={styles.gameOverOverlay}>
            <h2>Game Over</h2>
            <button onClick={onRestart}>
                Try Again
            </button>
        </div>
    );
}