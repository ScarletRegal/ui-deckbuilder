import styles from './Header.module.css';

interface HeaderProps {
    turnsRemaining: number;
    maxTurns: number;
    prompt: string;
    onPause?: () => void;
}

export function Header({ turnsRemaining, maxTurns, prompt, onPause }: HeaderProps) {
    // Calculate timer percentage
    const timerPercent = (turnsRemaining / maxTurns) * 100;

    return (
        <header className={styles.headerArea}>
            <div className={styles.timerBar}>
                <div
                    className={styles.timerBarFill}
                    style={{ width: `${timerPercent}%` }}
                />
                <div className={styles.timerCircle}>
                    {turnsRemaining}
                </div>
            </div>
            <div className={styles.promptChip}>
                {prompt}
            </div>
            <button className={styles.pauseButton} onClick={onPause}>
                <span className="icon">pause</span>
            </button>
        </header>
    );
}