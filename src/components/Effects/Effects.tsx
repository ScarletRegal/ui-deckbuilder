import { useState } from 'react';
import styles from './Effects.module.css';

interface EffectsProps {
    paletteName: string;
    paletteColors: string[];
    fontFamily: string;
    activeColor: string | null;
}

type EffectType = 'palette' | 'font' | 'color';

export function Effects({
    paletteName,
    paletteColors,
    fontFamily,
    activeColor
}: EffectsProps) {

    const [activePopup, setActivePopup] = useState<EffectType | null>(null);

    const closePopup = () => setActivePopup(null);

    return (
        <>
            {/* --- THE MAIN BAR (Always Visible) --- */}
            <div className={styles.effectsContainer}>

                {/* Palette Button */}
                <div
                    className={styles.effectIcon}
                    onClick={() => setActivePopup('palette')}
                    title="Current Palette"
                >
                    <span className="icon">palette</span>
                </div>

                {/* Font Button */}
                <div
                    className={styles.effectIcon}
                    onClick={() => setActivePopup('font')}
                    title="Current Font"
                >
                    <span className="icon">text_fields</span>
                </div>

                {/* Active Color (Only if active) */}
                {activeColor && (
                    <div
                        className={styles.effectIcon}
                        onClick={() => setActivePopup('color')}
                        title="Active Color"
                    >
                        <div
                            className={styles.miniSwatch}
                            style={{ backgroundColor: activeColor }}
                        />
                    </div>
                )}
            </div>

            {/* --- THE POPUP OVERLAY (Conditional) --- */}
            {activePopup && (
                <div className={styles.backdrop} onClick={closePopup}>
                    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div className={styles.popupHeader}>
                            <h3 className={styles.popupTitle}>
                                {activePopup === 'palette' && 'Active Palette'}
                                {activePopup === 'font' && 'Active Font'}
                                {activePopup === 'color' && 'Active Color Buff'}
                            </h3>
                            <button className={styles.closeButton} onClick={closePopup}>
                                <span className="icon">close</span>
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className={styles.popupContent}>

                            {/* 1. PALETTE PREVIEW */}
                            {activePopup === 'palette' && (
                                <>
                                    <div className={styles.paletteName}>{paletteName}</div>
                                    <div className={styles.paletteGrid}>
                                        {paletteColors.map((color, idx) => (
                                            <div
                                                key={idx}
                                                className={styles.colorCell}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <p className={styles.description}>
                                        Cards like "Generate Color" will create cards from this pool.
                                    </p>
                                </>
                            )}

                            {/* 2. FONT PREVIEW */}
                            {activePopup === 'font' && (
                                <>
                                    <div className={styles.fontPreview} style={{ fontFamily: fontFamily }}>
                                        Aa
                                    </div>
                                    <div className={styles.fontName}>{fontFamily}</div>
                                    <p className={styles.description}>
                                        All new text elements added to the design will use this typeface.
                                    </p>
                                </>
                            )}

                            {/* 3. ACTIVE COLOR PREVIEW */}
                            {activePopup === 'color' && activeColor && (
                                <>
                                    <div
                                        className={styles.largeSwatch}
                                        style={{ backgroundColor: activeColor }}
                                    />
                                    <div className={styles.colorCode}>{activeColor}</div>
                                    <p className={styles.description}>
                                        You have a color loaded! The next ELEMENT card you play will use this color.
                                    </p>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}