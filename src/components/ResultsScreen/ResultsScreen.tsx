import { useEffect } from 'react';
import styles from './ResultsScreen.module.css';

interface ResultsScreenProps {
    onGradingComplete: () => void;
}

export function ResultsScreen({ onGradingComplete }: ResultsScreenProps) {

    // Trigger the grading function immediately when this screen mounts
    useEffect(() => {
        // You can add a small setTimeout here if you want artificial "thinking" time
        // e.g., setTimeout(() => onGradingComplete(), 2000);
        onGradingComplete();
    }, [onGradingComplete]);

    return (
        <div className={styles.backdrop}>
            <div className={styles.container}>
                <div className={styles.spinner} />
                <h2 className={styles.text}>Analyzing Design...</h2>
                <p className={styles.subtext}>The AI Agent is reviewing your component.</p>
            </div>
        </div>
    );
}