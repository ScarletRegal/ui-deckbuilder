import styles from './Home.module.css';

interface HomeScreenProps {
    onPlay: () => void;
}

export function HomeScreen({ onPlay }: HomeScreenProps) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.logoPlaceholder}>
                    <span className="icon" style={{ fontSize: '64px' }}>layers</span>
                </div>
                <h1 className={styles.title}>Design Deckbuilder</h1>
                <p className={styles.subtitle}>Master the principles of UI design.</p>

                <button className={styles.playButton} onClick={onPlay}>
                    <span className="icon">play_arrow</span>
                    Play
                </button>
            </div>
        </div>
    );
}