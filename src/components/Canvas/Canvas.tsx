import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { type DesignCanvas } from '../../types/game.types';
import styles from './Canvas.module.css';

interface CanvasProps {
    canvas: DesignCanvas;
}

const getDimension = (mode: "fluid" | "fixed" | "fit"): string => {
    switch (mode) {
        case "fluid":
            return "100%"; // Full width/height of the container
        case "fixed":
            return "200px"; // The 200x200 you mentioned
        case "fit":
            return "fit-content"; // Shrink-to-fit
        default:
            return "100%";
    }
};

export function Canvas({ canvas }: CanvasProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: 'canvas-drop-area',
    });

    const droppableClasses = `${styles.canvasArea} ${isOver ? styles.droppableHover : ''}`;

    // The inline style object now controls size AND color
    const canvasStyle: React.CSSProperties = {
        // 1. Use backgroundColor for the fill
        backgroundColor: canvas.backgroundColor || 'transparent',

        // 2. Use strokeColor for the outline
        outline: canvas.strokeColor
            ? `2px solid ${canvas.strokeColor}`
            : '2px solid var(--primary-light)',

        width: getDimension(canvas.widthMode),
        height: getDimension(canvas.heightMode),
    };

    const contentStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: canvas.layout === 'column' ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: `${canvas.padding}px`,
    };

    return (
        <main ref={setNodeRef} className={droppableClasses}>
            <div className={styles.playerCanvas} style={canvasStyle}>
                { /*
                <div className={styles.corner}></div>
                <div className={styles.corner}></div>
                <div className={styles.corner}></div>
                <div className={styles.corner}></div>
                */}

                <div className={styles.canvasContent} style={contentStyle}>

                    {/* Render Icon if present */}
                    {canvas.icon && (
                        <span
                            className="icon"
                            style={{
                                color: canvas.icon.color,
                                fontSize: `${canvas.icon.size}px`
                            }}
                        >
                            {canvas.icon.materialIconName}
                        </span>
                    )}

                    {canvas.text && (() => {
                        // Inside this function, TypeScript knows canvas.text is not null.
                        const text = canvas.text;
                        const style = canvas.textStyles.find(ts => ts.name === text.styleName);

                        // If we also find the style, render the component
                        if (style) {
                            return (
                                <span
                                    style={{
                                        fontFamily: canvas.fontFamily,
                                        fontSize: `${style.fontSize}px`,
                                        fontWeight: style.fontWeight,
                                        color: canvas.text.color, // Now safe
                                    }}
                                >
                                    {canvas.text.text} {/* Now safe */}
                                </span>
                            );
                        }
                        // If style wasn't found, render nothing
                        return null;
                    })()}

                </div>
            </div>
        </main>
    );
}