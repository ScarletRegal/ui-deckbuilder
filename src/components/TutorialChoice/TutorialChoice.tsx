import styles from './TutorialChoice.module.css';

interface TutorialChoiceProps {
    onStartTutorial: () => void;
    onSkip: () => void;
}

export function TutorialChoice({ onStartTutorial, onSkip }: TutorialChoiceProps) {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Welcome!</h2>
                <p className={styles.description}>
                    Would you like to learn the basics or jump straight into the design challenges?
                </p>

                <div className={styles.buttonGroup}>
                    <button className={styles.tutorialButton} onClick={onStartTutorial}>
                        <span className="icon">school</span>
                        Start Tutorial
                    </button>

                    <button className={styles.skipButton} onClick={onSkip}>
                        Skip to Challenge
                    </button>
                </div>
            </div>
        </div>
    );
}