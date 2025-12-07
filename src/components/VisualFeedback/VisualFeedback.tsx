import React, { useEffect, useState, useRef } from 'react';
import { type DesignCanvas } from '../../types/game.types';
import styles from './VisualFeedback.module.css';

interface VisualFeedbackProps {
    canvas: DesignCanvas;
}

/**
 * Hook to store the previous value of a prop/state
 */
function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>(value);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export function VisualFeedback({ canvas }: VisualFeedbackProps) {
    const prevCanvas = usePrevious(canvas);

    // --- ANIMATION STATES ---
    const [showPadding, setShowPadding] = useState(false);
    const [layoutAnim, setLayoutAnim] = useState<'row' | 'column' | null>(null);

    // We store an object { color, id } to ensure the key changes even if color is same
    const [flashData, setFlashData] = useState<{ color: string, id: number } | null>(null);

    const [paletteFlash, setPaletteFlash] = useState<{ colors: string[], id: number } | null>(null);

    // --- 1. DETECT PADDING CHANGE ---
    useEffect(() => {
        if (prevCanvas && canvas.padding !== prevCanvas.padding) {
            setShowPadding(true);
            const timer = setTimeout(() => setShowPadding(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [canvas.padding, prevCanvas]);

    // --- 2. DETECT LAYOUT CHANGE ---
    useEffect(() => {
        if (prevCanvas && canvas.layout !== prevCanvas.layout) {
            if (canvas.layout === 'row') setLayoutAnim('row');
            if (canvas.layout === 'column') setLayoutAnim('column');

            const timer = setTimeout(() => setLayoutAnim(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [canvas.layout, prevCanvas]);

    // --- 3. DETECT ACTIVE COLOR SET ---
    useEffect(() => {
        if (prevCanvas && canvas.activeColor !== prevCanvas.activeColor && canvas.activeColor) {
            // --- FIX: Set a unique object to force re-render with new key ---
            setFlashData({ color: canvas.activeColor, id: Date.now() });

            const timer = setTimeout(() => setFlashData(null), 1200);
            return () => clearTimeout(timer);
        }
    }, [canvas.activeColor, prevCanvas]);

    // --- 4. DETECT PALETTE CHANGE ---
    useEffect(() => {
        if (prevCanvas && canvas.paletteName !== prevCanvas.paletteName) {
            // Grab first 3 colors to show off the new palette
            const colorsToShow = canvas.colors.slice(0, 3);
            setPaletteFlash({ colors: colorsToShow, id: Date.now() });

            // Clear after animation (1.2s duration + 0.4s max delay ~ 1.6s)
            const timer = setTimeout(() => setPaletteFlash(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [canvas.paletteName, canvas.colors, prevCanvas]);

    return (
        <div className={styles.overlayContainer} style={{ borderRadius: 'inherit' }}>

            {/* PADDING VISUALIZER */}
            <div
                className={`${styles.paddingBox} ${showPadding ? styles.active : ''}`}
                style={{
                    borderWidth: `${canvas.padding}px`,
                    borderRadius: 'inherit'
                }}
            />

            {/* LAYOUT ARROWS */}
            {layoutAnim === 'row' && (
                <div className={styles.arrowContainer}>
                    <span className={`icon ${styles.arrowIcon} ${styles.animateRight}`}>arrow_forward</span>
                    <span className={`icon ${styles.arrowIcon} ${styles.animateRight} ${styles.delay1}`}>arrow_forward</span>
                    <span className={`icon ${styles.arrowIcon} ${styles.animateRight} ${styles.delay2}`}>arrow_forward</span>
                </div>
            )}

            {layoutAnim === 'column' && (
                <div className={`${styles.arrowContainer} ${styles.column}`}>
                    <span className={`icon ${styles.arrowIcon} ${styles.animateDown}`}>arrow_downward</span>
                    <span className={`icon ${styles.arrowIcon} ${styles.animateDown} ${styles.delay1}`}>arrow_downward</span>
                    <span className={`icon ${styles.arrowIcon} ${styles.animateDown} ${styles.delay2}`}>arrow_downward</span>
                </div>
            )}

            {/* --- ACTIVE COLOR SWATCH --- */}
            {flashData && (
                <div
                    key={flashData.id}
                    className={styles.activeColorSwatch}
                    style={{ backgroundColor: flashData.color }}
                />
            )}

            {/* --- PALETTE SWATCHES --- */}
            {paletteFlash && paletteFlash.colors.map((color, index) => (
                <div
                    key={`${paletteFlash.id}-${index}`}
                    className={styles.paletteSwatch}
                    style={{
                        backgroundColor: color,
                        // Offset them: Left (-70px), Center (0), Right (+70px)
                        left: `calc(50% + ${(index - 1) * 70}px)`,
                        // Stagger animation by 0.2s each
                        animationDelay: `${index * 0.2}s`
                    }}
                />
            ))}

        </div>
    );
}