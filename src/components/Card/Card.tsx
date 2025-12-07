import { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';

import { type Card as CardType } from '../../types/card.types';
import styles from './Card.module.css';

interface CardProps {
    card: CardType;
    isDisabled: boolean;
    onPreview: (card: CardType) => void;
    rotation?: number;
    translateY?: number;
    zIndex?: number;
    mode?: 'hand' | 'grid';
}

const BASE_SCALE = 0.5;
const HOVER_SCALE = 0.55;

export function Card({
    card,
    isDisabled,
    onPreview,
    rotation = 0,
    translateY = 0,
    zIndex = 0,
    mode = 'hand',
}: CardProps) {

    const [isHovering, setIsHovering] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: card.id,
        disabled: isDisabled,
    });

    const style = useMemo(() => {
        const scale = isDragging ? HOVER_SCALE : (isHovering ? HOVER_SCALE : BASE_SCALE);
        const dragTransform = transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : `translateY(${isHovering ? -10 : translateY}px)`;
        const rotateTransform = `rotate(${rotation}deg)`;
        const scaleTransform = `scale(${scale})`;
        const combinedTransform = [dragTransform, rotateTransform, scaleTransform].join(' ');

        return {
            transform: combinedTransform,
            zIndex: isDragging ? 1000 : (isHovering ? 100 : zIndex),
        };
    }, [isDragging, isHovering, transform, rotation, translateY, zIndex]);

    const handleClick = () => {
        if (!isDisabled || mode === 'grid') {
            onPreview(card);
        }
    };

    const classNames = `${styles.cardWrapper} ${isDisabled ? styles.disabled : ''
        } ${isDragging ? styles.dragging : ''} ${mode === 'grid' ? styles.gridMode : ''}`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={classNames}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className={styles.cardContent}>
                <div className={styles.header}>
                    <span className={styles.focusCost}>{card.focusCost}</span>
                </div>
                <strong className={styles.name}>{card.name}</strong>
                <p className={styles.description}>{card.description}</p>
                <span className={styles.category}>{card.mainCategory}</span>
            </div>
        </div>
    );
}