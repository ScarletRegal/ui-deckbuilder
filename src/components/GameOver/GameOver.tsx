import styles from './GameOver.module.css';

interface GameOverOverlayProps {
    feedback: string;
    onRestart: () => void;
}

export function GameOver({ feedback, onRestart }: GameOverOverlayProps) {
    return (
        <div className={styles.backdrop}>
            <div className={styles.content}>
                <h2 className={styles.title}>Encounter Failed</h2>

                <div className={styles.feedbackBox}>
                    <strong>Agent Feedback:</strong>
                    <p>{feedback}</p>
                </div>

                <button className={styles.restartButton} onClick={onRestart}>
                    Try Again
                </button>
            </div>
        </div>
    );
}