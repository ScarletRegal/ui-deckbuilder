// src/components/Canvas/Canvas.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { type DesignCanvas } from '../../types/game.types';
import styles from './Canvas.module.css';
import { VisualFeedback } from '../VisualFeedback/VisualFeedback';

interface CanvasProps {
    canvas: DesignCanvas;
    onShowInfo: () => void;
}

const getDimension = (mode: "fluid" | "fixed" | "fit"): string => {
    switch (mode) {
        case "fluid": return "100%";
        case "fixed": return "200px";
        case "fit": return "fit-content";
        default: return "100%";
    }
};

export function Canvas({ canvas, onShowInfo }: CanvasProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: 'canvas-drop-area',
    });

    const droppableClasses = `${styles.canvasArea} ${isOver ? styles.droppableHover : ''
        }`;

    // 1. Calculate Background Color & Opacity based on Fill Type
    let appliedBgColor = 'transparent';
    let appliedOpacity = 1;

    if (canvas.fillType !== 'none') {
        appliedBgColor = canvas.backgroundColor || 'transparent';
        if (canvas.fillType === 'opaque') {
            appliedOpacity = 0.5; // 50% opacity for "Opaque/Translucent" feel
        }
    }

    // 2. Calculate Shape (Border Radius & Aspect Ratio)
    let borderRadius = '0px';
    let aspectRatio = 'auto';

    if (canvas.shape === 'rounded') {
        borderRadius = '100px';
    }

    // 3. Calculate Dimensions
    let width = getDimension(canvas.widthMode);
    let height = getDimension(canvas.heightMode);

    if (canvas.shape === 'rectangle') {
        if (canvas.layout === 'column') {
            width = '75px';
            height = '200px';
        } else {
            width = '200px';
            height = '75px';
        }
    }

    // 4. Calculate Layout (Flex vs Block)
    const isFlex = canvas.layout !== 'block';
    const flexDirection = canvas.layout === 'column' ? 'column' : 'row';

    // --- CONTAINER STYLE ---
    const canvasStyle: React.CSSProperties = {
        backgroundColor: appliedBgColor,
        opacity: appliedOpacity, // Applies to the whole element

        borderRadius: borderRadius,
        aspectRatio: aspectRatio,

        // Outline logic (unchanged)
        outline: canvas.strokeColor
            ? `2px solid ${canvas.strokeColor}`
            : '2px solid var(--primary-light)',

        width: width,
        height: height,

        transition: 'all 0.3s ease',
    };

    // --- CONTENT STYLE ---
    const contentStyle: React.CSSProperties = {
        // Change display based on layout state
        display: isFlex ? 'flex' : 'block',

        flexDirection: flexDirection,

        // Only center content if we are in Flex mode
        alignItems: isFlex ? 'center' : undefined,
        justifyContent: isFlex ? 'center' : undefined,

        gap: '8px',
        padding: `${canvas.padding}px`,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
    };

    return (
        <main ref={setNodeRef} className={droppableClasses}>

            <button className={styles.infoButton} onClick={onShowInfo} title="Component Status">
                <span className="icon" style={{ fontSize: '20px' }}>info</span>
            </button>
            <div className={styles.playerCanvas} style={canvasStyle}>

                <div className={styles.corner}></div>
                <div className={styles.corner}></div>
                <div className={styles.corner}></div>
                <div className={styles.corner}></div>

                <VisualFeedback canvas={canvas} />

                <div className={styles.canvasContent} style={contentStyle}>

                    {/* Text */}
                    {canvas.text && (() => {
                        const style = canvas.textStyles.find(ts => ts.name === canvas.text!.styleName);
                        if (style) {
                            return (
                                <span
                                    style={{
                                        fontFamily: canvas.fontFamily,
                                        fontSize: `${style.fontSize}px`,
                                        fontWeight: style.fontWeight,
                                        color: canvas.text!.color,
                                        display: 'inline-block'
                                    }}
                                >
                                    {canvas.text!.text}
                                </span>
                            );
                        }
                        return null;
                    })()}

                    {/* Icon */}
                    {canvas.icon && (
                        <span
                            className="icon"
                            style={{
                                color: canvas.icon.color,
                                fontSize: `${canvas.icon.size}px`,
                                // If block layout, ensure it behaves inline-block or block
                                display: 'inline-block'
                            }}
                        >
                            {canvas.icon.materialIconName}
                        </span>
                    )}

                </div>
            </div>
        </main>
    );
}