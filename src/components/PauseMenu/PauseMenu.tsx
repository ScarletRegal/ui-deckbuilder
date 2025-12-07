import { useState } from 'react';
import styles from './PauseMenu.module.css';

interface PauseMenuProps {
    onResume: () => void;
    onQuit: () => void;
}

export function PauseMenu({ onResume, onQuit }: PauseMenuProps) {
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <div className={styles.backdrop}>
            <div className={styles.menuCard}>

                {/* Title Area */}
                <h2 className={styles.title}>
                    {isConfirming ? "Quit Game?" : "Paused"}
                </h2>

                {/* Content Area */}
                {isConfirming ? (
                    <div className={styles.content}>
                        <p className={styles.warningText}>
                            You will lose all progress in this run. Are you sure?
                        </p>
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.resumeButton}
                                onClick={() => setIsConfirming(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.quitButton}
                                onClick={onQuit}
                            >
                                Quit to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <button className={styles.resumeButton} onClick={onResume}>
                            <span className="icon">play_arrow</span>
                            Resume
                        </button>
                        <button
                            className={styles.secondaryButton}
                            onClick={() => setIsConfirming(true)}
                        >
                            <span className="icon">logout</span>
                            Quit
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}