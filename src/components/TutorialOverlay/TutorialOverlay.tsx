import styles from './TutorialOverlay.module.css';

interface TutorialOverlayProps {
    message: string;
    onDismiss: () => void;
}

export function TutorialOverlay({ message, onDismiss }: TutorialOverlayProps) {
    return (
        <div className={styles.backdrop}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <span className="icon">school</span>
                </div>
                <h3 className={styles.title}>Tutorial</h3>
                <div className={styles.message}>
                    {message.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
                <button className={styles.button} onClick={onDismiss}>
                    Got it
                </button>
            </div>
        </div>
    );
}