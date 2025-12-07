import { useReducer, useEffect, useState } from 'react';
import {
    DndContext,
    type DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor
} from '@dnd-kit/core';

import { initialState } from './core/initialState';
import { type GameState } from './types/game.types';
import { type Card as CardType } from './types/card.types';
import {
    startEncounter,
    playCard,
    endTurn,
    processGradingResult,
    selectRewards,
    dismissTutorialMessage,
    showCurrentTutorialMessage
} from './core/gameEngine';
import { gradeDesign, type GradeResult } from './core/gradingAgent';
import { encounterLibrary } from './core/encounterLibrary';

// Import all UI components
import { Header } from './components/PlayerHUD/Header/Header';
import { Canvas } from './components/Canvas/Canvas';
import { Hand } from './components/Hand/Hand';
import { Footer } from './components/PlayerHUD/Footer/Footer';
import { Effects } from './components/Effects/Effects';
import { GameOver } from './components/GameOver/GameOver';
import { CardPreview } from './components/CardPreview/CardPreview';
import { ResultsScreen } from './components/ResultsScreen/ResultsScreen';
import { RewardScreen } from './components/RewardScreen/RewardScreen';

import styles from './App.module.css';
import './style.css';
import { HomeScreen } from './components/Pages/Home/Home';
import { TutorialChoice } from './components/TutorialChoice/TutorialChoice';
import { TutorialOverlay } from './components/TutorialOverlay/TutorialOverlay';
import { ComponentInfoOverlay } from './components/ComponentInfoOverlay/ComponentInfoOverlay';
import { DeckScreen } from './components/DeckScreen/DeckScreen';
import { PauseMenu } from './components/PauseMenu/PauseMenu';

// --- 1. Define All Game Actions ---
type GameAction =
    | { type: 'SHOW_HOME' }
    | { type: 'SHOW_TUTORIAL_CHOICE' }
    | { type: 'DISMISS_TUTORIAL' }
    | { type: 'START_ENCOUNTER'; payload: { encounterIndex: number } }
    | { type: 'PLAY_CARD'; payload: { card: CardType } }
    | { type: 'END_TURN' }
    | { type: 'PROCESS_RESULTS'; payload: GradeResult }
    | { type: 'SELECT_REWARD'; payload: { cards: CardType[] } }
    | { type: 'SHOW_CURRENT_TUTORIAL' };

// --- 2. Create the Game Reducer ---
function gameReducer(state: GameState, action: GameAction): GameState {

    // "Lock" the game on the Run Over screen until a restart
    if (state.phase === 'runOver' && action.type !== 'START_ENCOUNTER' && action.type !== 'SHOW_HOME') {
        return state;
    }

    switch (action.type) {
        case 'SHOW_HOME':
            return { ...initialState, phase: 'home' };

        case 'SHOW_TUTORIAL_CHOICE':
            return { ...state, phase: 'tutorialChoice' };

        case 'DISMISS_TUTORIAL':
            return dismissTutorialMessage(state);

        case 'START_ENCOUNTER':
            return startEncounter(state, action.payload.encounterIndex);

        case 'PLAY_CARD':
            if (state.phase !== 'playerTurn') return state;
            const { card } = action.payload;
            if (card.focusCost > state.player.focus) {
                console.log('Not enough focus!');
                return state;
            }
            const newState = JSON.parse(JSON.stringify(state));
            return playCard(newState, card);

        case 'END_TURN':
            if (state.phase !== 'playerTurn') return state;
            return endTurn(state);

        case 'PROCESS_RESULTS':
            // Call the synchronous engine function with the API result
            return processGradingResult(state, action.payload);

        case 'SELECT_REWARD':
            return selectRewards(state, action.payload.cards);

        case 'SHOW_CURRENT_TUTORIAL':
            return showCurrentTutorialMessage(state);

        default:
            return state;
    }
}

// --- 3. The Main App Component ---
function App() {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [previewCard, setPreviewCard] = useState<CardType | null>(null);
    const [previewSource, setPreviewSource] = useState<'hand' | 'deck' | null>(null);
    const [showComponentInfo, setShowComponentInfo] = useState(false);
    const [showDeckScreen, setShowDeckScreen] = useState(false);
    const [isDiscarding, setIsDiscarding] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Sensor setup for dnd-kit (mouse + touch)
    // We only use PointerSensor which handles both efficiently
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // 10px "dead zone" allows clicks/taps to work
            },
        })
    );

    // --- Game Loop Effect ---
    // This effect runs when the game phase changes to 'setup'
    useEffect(() => {
        if (state.phase === 'setup') {
            if (state.encounterIndex < encounterLibrary.length) {
                dispatch({
                    type: 'START_ENCOUNTER',
                    payload: { encounterIndex: state.encounterIndex }
                });
            } else {
                // Game Complete (Ran out of encounters) -> Return to Home for now
                console.log("All encounters complete!");
                dispatch({ type: 'SHOW_HOME' });
            }
        }
    }, [state.phase, state.encounterIndex]);

    // --- Event Handlers ---

    const handleHandPreview = (card: CardType) => {
        setPreviewCard(card);
        setPreviewSource('hand');
    };

    // Called when clicking a card in DECK VIEWER
    const handleDeckPreview = (card: CardType) => {
        setPreviewCard(card);
        setPreviewSource('deck');
    };

    const handlePreviewPlay = (card: CardType) => {
        // Double check security: only play if source was hand
        if (previewSource === 'hand') {
            dispatch({ type: 'PLAY_CARD', payload: { card: card } });
            setPreviewCard(null);
            setPreviewSource(null);
        }
    };

    const handleClosePreview = () => {
        setPreviewCard(null);
        setPreviewSource(null);
    };

    const handleToggleComponentInfo = () => {
        setShowComponentInfo(!showComponentInfo);
    }

    const handleToggleDeckScreen = () => {
        setShowDeckScreen(!showDeckScreen);
    }

    const handlePlayClick = () => {
        dispatch({ type: 'SHOW_TUTORIAL_CHOICE' })
    }

    const handleStartTutorial = () => {
        // TODO: Implement tutorial encounter
        dispatch({ type: 'START_ENCOUNTER', payload: { encounterIndex: 0 } });
    }

    const handleSkipTutorial = () => {
        dispatch({ type: 'START_ENCOUNTER', payload: { encounterIndex: 1 } });
    }

    const handleDismissTutorial = () => { dispatch({ type: 'DISMISS_TUTORIAL' }); };

    const handleDragEnd = (event: DragEndEvent) => {
        if (event.over && event.over.id === 'canvas-drop-area') {
            const cardId = event.active.id;
            const cardToPlay = state.player.hand.find(c => c.id === cardId);
            if (cardToPlay) {
                dispatch({
                    type: 'PLAY_CARD',
                    payload: { card: cardToPlay }
                });
            }
        }
    };

    const handleEndTurnClick = () => {
        // 1. Start Animation
        setIsDiscarding(true);

        // 2. Wait for cards to fly away
        // (0.05s * 5 cards = 0.25s delay) + (0.4s animation duration) ~= 650ms total safe wait
        setTimeout(() => {
            dispatch({ type: 'END_TURN' });
            setIsDiscarding(false);
        }, 600);
    };

    const handleRestartGame = () => {
        // Restart from the beginning
        dispatch({ type: 'SHOW_HOME' });
    };

    const handlePauseGame = () => {
        setIsPaused(true);
    };

    const handleResumeGame = () => {
        setIsPaused(false);
    };

    const handleQuitGame = () => {
        setIsPaused(false);
        dispatch({ type: 'SHOW_HOME' });
    };

    /**
     * Called by ResultsScreen when its "loading" animation is done.
     * This is where we make the async API call.
     */
    const handleGradingComplete = async () => {
        if (!state.currentEncounter) return;

        // 1. Check for Tutorial Override
        if (state.currentEncounter.id === 'e_tutorial') {
            // Skip API call for tutorial. Auto-pass.
            const tutorialResult: GradeResult = {
                pass: true,
                feedback: "Great work! You've mastered the basics of Layouts, Colors, and Shapes. Now you have a new tool: Icons! \n\nThe goal of these challenges is to create a component in a certian number of turns. Use your cards wisely to design a UI that matches the prompt. Good luck!"
            };
            dispatch({ type: 'PROCESS_RESULTS', payload: tutorialResult });
            return;
        }

        // 2. Normal Grading (API Call)
        try {
            const result = await gradeDesign(state.currentEncounter, state.player.canvas);
            dispatch({ type: 'PROCESS_RESULTS', payload: result });
        } catch (error) {
            console.error("Grading error:", error);
            dispatch({
                type: 'PROCESS_RESULTS',
                payload: { pass: false, feedback: "Error: Grading service unavailable." }
            });
        }
    };

    /**
     * Called by RewardScreen when a card is clicked.
     */
    const handleSelectRewards = (cards: CardType[]) => {
        dispatch({ type: 'SELECT_REWARD', payload: { cards } });
    };

    const handleShowTutorialHint = () => {
        dispatch({ type: 'SHOW_CURRENT_TUTORIAL' });
    };

    // --- Render Logic ---


    if (state.phase === 'home') {
        return <HomeScreen onPlay={handlePlayClick} />;
    }

    if (state.phase === 'tutorialChoice') {
        return (
            <>
                <HomeScreen onPlay={() => { }} />
                <TutorialChoice
                    onStartTutorial={handleStartTutorial}
                    onSkip={handleSkipTutorial}
                />
            </>
        );
    }
    // Show loading screen until the first encounter is ready
    if (state.phase === 'setup' || !state.currentEncounter) {
        return <div>Loading Game...</div>;
    }

    // Get the AI's feedback (stored on the encounter object by the engine)
    const feedback = (state.currentEncounter as any).feedback || "No feedback was provided.";

    // 1. Check if we are in the tutorial
    const isTutorial = state.currentEncounter.id === 'e_tutorial';

    // 2. Check if hand is empty
    const isHandEmpty = state.player.hand.length === 0;

    // 3. Determine if disabled:
    //    - Normal game: Disabled if not player turn
    //    - Tutorial: Disabled if not player turn OR hand is not empty
    const isEndTurnDisabled = isTutorial
        ? (state.phase !== 'playerTurn' || !isHandEmpty)
        : (state.phase !== 'playerTurn');

    const isDeckDisabled = isTutorial;

    return (
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <div className={styles.gameBoard}>

                {/* --- Main Game UI --- */}
                <Header
                    prompt={state.currentEncounter.promptName}
                    turnsRemaining={state.turnsRemaining}
                    maxTurns={state.maxTurns}
                    onPause={handlePauseGame}
                />
                <Canvas
                    canvas={state.player.canvas} onShowInfo={handleToggleComponentInfo}
                />
                <Hand
                    hand={state.player.hand}
                    playerFocus={state.player.focus}
                    phase={state.phase}
                    onPreview={handleHandPreview}
                    isDiscarding={isDiscarding}
                />
                <Effects
                    paletteName={state.player.canvas.paletteName}
                    paletteColors={state.player.canvas.colors}
                    fontFamily={state.player.canvas.fontFamily}
                    activeColor={state.player.canvas.activeColor}
                />
                <Footer
                    onEndTurnClick={handleEndTurnClick}
                    onDeckClick={handleToggleDeckScreen}
                    isTurnDisabled={isEndTurnDisabled}
                    isDeckDisabled={isDeckDisabled}
                    playerFocus={state.player.focus}
                    maxFocus={state.player.maxFocus}
                />

                {/* --- Overlays (Render based on game phase) --- */}

                {isPaused && (
                    <PauseMenu
                        onResume={handleResumeGame}
                        onQuit={handleQuitGame}
                    />
                )}

                {state.currentEncounter?.id === 'e_tutorial' && !state.tutorialMessage && (
                    <button
                        className={styles.tutorialHelpButton}
                        onClick={handleShowTutorialHint}
                        title="Show Tutorial Hint"
                    >
                        <span className="icon">school</span>
                    </button>
                )}

                {showDeckScreen && (
                    <DeckScreen
                        deck={state.player.deck}
                        discard={state.player.discard}
                        exhausted={state.player.exhausted}
                        onClose={() => setShowDeckScreen(false)}
                        onPreview={handleDeckPreview}
                    />
                )}

                {showComponentInfo && (
                    <ComponentInfoOverlay
                        canvas={state.player.canvas}
                        onClose={() => setShowComponentInfo(false)}
                    />
                )}

                {state.tutorialMessage && (
                    <TutorialOverlay
                        message={state.tutorialMessage}
                        onDismiss={handleDismissTutorial}
                    />
                )}

                {state.phase === 'results' && (
                    <ResultsScreen onGradingComplete={handleGradingComplete} />
                )}

                {state.phase === 'reward' && (
                    <RewardScreen
                        rewards={state.rewardCards}
                        feedback={feedback}
                        onProceed={handleSelectRewards}
                    />
                )}

                {state.phase === 'runOver' && (
                    <GameOver
                        feedback={feedback}
                        onRestart={handleRestartGame}
                    />
                )}

                {previewCard && (
                    <CardPreview
                        card={previewCard}
                        // Only playable if it came from HAND and it's your turn
                        isPlayable={previewSource === 'hand' && state.phase === 'playerTurn' && previewCard.focusCost <= state.player.focus}
                        // Only show button if came from HAND
                        showPlayButton={previewSource === 'hand'}
                        onClose={handleClosePreview}
                        onPlay={handlePreviewPlay}
                    />
                )}

            </div>
        </DndContext>
    );
}

export default App;