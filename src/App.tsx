import { useReducer, useEffect, useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';

import { initialState } from './core/initialState';
import { type GameState } from './types/game.types';
import { type Card as CardType } from './types/card.types';
import { startGame, playCard, endTurn } from './core/gameEngine';

// Import all child components
import { Header } from './components/PlayerHUD/Header/Header';
import { Canvas } from './components/Canvas/Canvas';
import { Hand } from './components/Hand/Hand';
import { Footer } from './components/PlayerHUD/Footer/Footer';
import { GameOverOverlay } from './components/GameOver/GameOver';
import { CardPreview } from './components/CardPreview/CardPreview';

import styles from './App.module.css';
import './style.css';
import { Effects } from './components/Effects/Effects';

// --- 1. Define Actions ---
type GameAction =
    | { type: 'START_GAME' }
    | { type: 'PLAY_CARD'; payload: { card: CardType } }
    | { type: 'END_TURN' };

// --- 2. Create the Reducer ---
function gameReducer(state: GameState, action: GameAction): GameState {

    if (state.phase === 'gameOver' && action.type !== 'START_GAME') {
        return state;
    }

    switch (action.type) {
        case 'START_GAME':
            return startGame(initialState);

        case 'PLAY_CARD': {
            const { card } = action.payload;

            if (card.focusCost > state.player.focus) {
                console.log('Not enough focus!');
                return state;
            }

            const newState = JSON.parse(JSON.stringify(state));
            return playCard(newState, card);
        }

        case 'END_TURN':
            return endTurn(state);

        default:
            return state;
    }
}

// --- 3. The Main App Component ---
function App() {
    // --- State Hooks ---
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [previewCard, setPreviewCard] = useState<CardType | null>(null);

    // Create a sensor with our 10px activation "dead zone"
    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Wait for a 10px drag before activating
            activationConstraint: {
                delay: 250,
                distance: 10,
            },
        }),
    );

    // --- Game Start Effect ---
    useEffect(() => {
        if (state.phase === 'setup') {
            dispatch({ type: 'START_GAME' });
        }
    }, [state.phase]);

    // --- Event Handlers ---

    /**
     * Called when a card is dragged and dropped.
     */
    const handleDragEnd = (event: DragEndEvent) => {

        // If handleDragEnd fires, we know it was a drag > 10px.
        // Just check if it was dropped on the canvas.
        if (event.over && event.over.id === 'canvas-drop-area') {

            const cardId = event.active.id;
            const cardToPlay = state.player.hand.find(c => c.id === cardId);

            if (cardToPlay && cardToPlay.focusCost <= state.player.focus) {
                dispatch({
                    type: 'PLAY_CARD',
                    payload: { card: cardToPlay }
                });
            }
        }
    };

    /**
     * Called when the "Play" button in the CardPreview is clicked.
     */
    const handlePreviewPlay = (card: CardType) => {
        dispatch({
            type: 'PLAY_CARD',
            payload: { card: card }
        });
        setPreviewCard(null); // Close preview after playing
    };

    /**
     * Called by the Footer's "End Turn" button.
     */
    const handleEndTurnClick = () => {
        dispatch({ type: 'END_TURN' });
    };

    /**
     * Called by the GameOverOverlay's "Restart" button.
     */
    const handleRestartGame = () => {
        dispatch({ type: 'START_GAME' });
    };

    // --- Render Logic ---
    if (state.phase === 'setup') {
        return <div>Loading Game...</div>;
    }

    return (
        // DndContext wraps the entire game
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>

            {/* gameBoard provides the main layout grid */}
            <div className={styles.gameBoard}>

                {/* All components are "dumb" and receive state as props */}
                <Header
                    prompt={state.prompt.componentName}
                    turnsRemaining={state.turnsRemaining}
                    maxTurns={state.maxTurns}
                />

                <Canvas canvas={state.player.canvas} />

                <Hand
                    hand={state.player.hand}
                    playerFocus={state.player.focus}
                    phase={state.phase}
                    onPreview={setPreviewCard} // Pass the "setter" to open the preview
                />

                <Effects
                    paletteName={state.player.canvas.paletteName}
                    fontFamily={state.player.canvas.fontFamily}
                    activeColor={state.player.canvas.activeColor}
                />

                <Footer
                    onEndTurnClick={handleEndTurnClick}
                    isTurnDisabled={state.phase !== 'playerTurn'}
                    playerFocus={state.player.focus}
                    maxFocus={state.player.maxFocus}
                />

                {/* --- Overlays (Conditionally Rendered) --- */}

                {state.phase === 'gameOver' && (
                    <GameOverOverlay onRestart={handleRestartGame} />
                )}

                {previewCard && (
                    <CardPreview
                        card={previewCard}
                        isPlayable={state.phase === 'playerTurn' && previewCard.focusCost <= state.player.focus}
                        onClose={() => setPreviewCard(null)} // Close on backdrop click
                        onPlay={handlePreviewPlay}
                    />
                )}

            </div>
        </DndContext>
    );
}

export default App;