import { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { type Card as CardType } from '../../types/card.types';
import { type GamePhase } from '../../types/game.types';
import { Card } from '../Card/Card';
import styles from './Hand.module.css';

interface HandProps {
    hand: CardType[];
    playerFocus: number;
    phase: GamePhase;
    onPreview: (card: CardType) => void;
    isDiscarding?: boolean;
}

export function Hand({
    hand,
    playerFocus,
    phase,
    onPreview,
    isDiscarding = false
}: HandProps) {

    const numCards = hand.length;
    const containerRef = useRef<HTMLElement>(null);
    const [containerWidth, setContainerWidth] = useState(window.innerWidth);

    // --- MONITOR SCREEN SIZE ---
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        // Initial measure
        updateWidth();

        // Listen for resize events
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // --- ARC & LAYOUT CONFIGURATION ---
    const cardWidth = 150;
    const fanRadius = 100;
    const maxFanAngle = 20;

    const angleStep = numCards > 1
        ? Math.min(10, maxFanAngle / (numCards - 1))
        : 0;

    // --- DYNAMIC SQUEEZE CALCULATION ---
    // 1. Define constraints
    const maxVisibleStrip = 60; // Ideal spacing (cards spread out)
    const minVisibleStrip = 30; // Minimum spacing before we force scrolling
    const containerPadding = 80; // Match CSS padding (40px left + 40px right)

    // 2. Calculate available width for the "fan"
    const availableWidth = Math.max(0, containerWidth - containerPadding);

    // 3. Calculate ideal strip width to fit ALL cards in available space
    // Formula: (AvailableWidth - WidthOfLastCard) / (RemainingCards)
    let calculatedStrip = maxVisibleStrip;

    if (numCards > 1) {
        const spaceForOverlaps = availableWidth - cardWidth;
        const stripToFit = spaceForOverlaps / (numCards - 1);

        // Clamp between Min and Max
        calculatedStrip = Math.max(minVisibleStrip, Math.min(maxVisibleStrip, stripToFit));
    }

    // 4. Convert visible strip to negative margin
    // e.g., If visible strip is 40px and card is 180px, margin is -140px.
    const dynamicMargin = calculatedStrip - cardWidth;

    const { setNodeRef } = useDroppable({
        id: 'hand-drop-area',
    });

    return (
        <section className={styles.handContainer} ref={containerRef}>
            <div ref={setNodeRef} className={styles.cardsWrapper}>
                {hand.map((card, index) => {
                    // 1. Rotation Logic
                    const indexFromCenter = index - (numCards - 1) / 2;
                    const rotation = indexFromCenter * angleStep;

                    // 2. Arc Offset Logic
                    const angleRad = (rotation * Math.PI) / 150;
                    const translateY = fanRadius * (1 - Math.cos(angleRad));

                    const delay = isDiscarding ? index * 0.05 : index * 0.1;

                    return (
                        <div
                            key={card.id}
                            className={`${styles.animWrapper} ${isDiscarding ? styles.exiting : styles.entering}`}
                            style={{
                                animationDelay: `${delay}s`,
                                // Apply calculated dynamic margin
                                marginLeft: index === 0 ? '-100px' : `${dynamicMargin}px`
                            }}
                        >
                            <Card
                                card={card}
                                isDisabled={phase !== 'playerTurn' || card.focusCost > playerFocus}
                                onPreview={onPreview}
                                rotation={rotation}
                                translateY={translateY}
                                zIndex={index}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}