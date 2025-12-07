import React from 'react';
import { type DesignCanvas } from '../../types/game.types';
import styles from './ComponentInfoOverlay.module.css';

interface ComponentInfoOverlayProps {
    canvas: DesignCanvas;
    onClose: () => void;
}

export function ComponentInfoOverlay({ canvas, onClose }: ComponentInfoOverlayProps) {

    // Helper to format property names nicely
    const StatRow = ({ label, value }: { label: string, value: string | number | React.ReactNode }) => (
        <div className={styles.statRow}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
        </div>
    );

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.card} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <span className="icon">info</span>
                    </div>
                    <h3 className={styles.title}>Component Status</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <span className="icon">close</span>
                    </button>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Layout & Shape</h4>
                    <StatRow label="Layout" value={canvas.layout.charAt(0).toUpperCase() + canvas.layout.slice(1)} />
                    <StatRow label="Shape" value={canvas.shape.charAt(0).toUpperCase() + canvas.shape.slice(1)} />
                    <StatRow label="Width" value={canvas.widthMode.charAt(0).toUpperCase() + canvas.widthMode.slice(1)} />
                    <StatRow label="Height" value={canvas.heightMode.charAt(0).toUpperCase() + canvas.heightMode.slice(1)} />
                    <StatRow label="Padding" value={`${canvas.padding}px`} />
                    <StatRow label="Radius" value={`${canvas.borderRadius}px`} />
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Style</h4>
                    <StatRow
                        label="Fill Type"
                        value={
                            <div className={styles.valueWithSwatch}>
                                {canvas.fillType.charAt(0).toUpperCase() + canvas.fillType.slice(1)}
                                {canvas.fillType !== 'none' && canvas.backgroundColor && (
                                    <div
                                        className={styles.colorSwatch}
                                        style={{
                                            backgroundColor: canvas.backgroundColor,
                                            opacity: canvas.fillType === 'opaque' ? 0.5 : 1
                                        }}
                                    />
                                )}
                            </div>
                        }
                    />
                    <StatRow
                        label="Stroke"
                        value={
                            canvas.strokeColor ? (
                                <div className={styles.valueWithSwatch}>
                                    Solid
                                    <div
                                        className={styles.colorSwatch}
                                        style={{ backgroundColor: canvas.strokeColor, border: '1px solid #eee' }}
                                    />
                                </div>
                            ) : "None"
                        }
                    />
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Children</h4>
                    <StatRow
                        label="Text"
                        value={
                            canvas.text ? (
                                <div className={styles.valueWithSwatch}>
                                    {canvas.text.styleName}
                                    <div
                                        className={styles.colorSwatch}
                                        style={{ backgroundColor: canvas.text.color, border: '1px solid #eee' }}
                                    />
                                </div>
                            ) : "None"
                        }
                    />
                    <StatRow
                        label="Icon"
                        value={
                            canvas.icon ? (
                                <div className={styles.valueWithSwatch}>
                                    {canvas.icon.materialIconName}
                                    <div
                                        className={styles.colorSwatch}
                                        style={{ backgroundColor: canvas.icon.color, border: '1px solid #eee' }}
                                    />
                                </div>
                            ) : "None"
                        }
                    />
                </div>

            </div>
        </div>
    );
}