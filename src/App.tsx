import { Component, createSignal, onMount, Show } from 'solid-js';

import styles from './App.module.css';
import { initGame } from './game/game';

const STORAGE_KEY = 'bitman-high-scores';

type HighScores = {
  [difficulty: number]: number;
};

const getHighScores = (): HighScores => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveHighScore = (difficulty: number, score: number) => {
  const highScores = getHighScores();
  if (!highScores[difficulty] || score > highScores[difficulty]) {
    highScores[difficulty] = score;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(highScores));
    } catch {
      // Ignore storage errors
    }
  }
};

// Get deploy time from environment variable (set during build)
const DEPLOY_TIME = import.meta.env.VITE_DEPLOY_TIME || new Date().toISOString();

const formatDeployTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  } catch {
    return 'Unknown';
  }
};

const App: Component = () => {
  const [score, setScore] = createSignal(0);
  const [highScores, setHighScores] = createSignal<HighScores>({});
  const [showHomeScreen, setShowHomeScreen] = createSignal(true);
  const [showGameOver, setShowGameOver] = createSignal(false);
  const [bombCount, setBombCount] = createSignal<number | null>(null);

  let gameCleanup: (() => void) | null = null;

  // Load high scores from localStorage on mount
  onMount(() => {
    setHighScores(getHighScores());
  });

  const getHighScoreForDifficulty = (difficulty: number | null): number => {
    if (difficulty === null) return 0;
    return highScores()[difficulty] || 0;
  };

  const increamentScore = () => {
    const newScore = score() + 1;
    setScore(newScore);

    const currentDifficulty = bombCount();
    if (currentDifficulty !== null) {
      const currentHighScore = getHighScoreForDifficulty(currentDifficulty);
      if (newScore > currentHighScore) {
        saveHighScore(currentDifficulty, newScore);
        setHighScores(getHighScores());
      }
    }

    return newScore;
  }

  const clearScore = () => {
    const lastScore = score();

    setScore(0);

    return lastScore;
  }

  const startGame = (difficulty: number) => {
    setBombCount(difficulty);
    setShowHomeScreen(false);
    setShowGameOver(false);
    
    const canvasContainer = document.querySelector("#canvas-container");
    if (canvasContainer) {
      // Clear any existing canvas
      canvasContainer.innerHTML = '';
      
      const cleanup = initGame(
        increamentScore, 
        clearScore, 
        canvasContainer,
        difficulty,
        () => {
          // Game over callback - show game over screen
          setShowGameOver(true);
        }
      );
      gameCleanup = cleanup;
    }
  }

  const returnToHome = () => {
    // Save final score if it's a new high score
    const currentDifficulty = bombCount();
    const finalScore = score();
    if (currentDifficulty !== null && finalScore > 0) {
      const currentHighScore = getHighScoreForDifficulty(currentDifficulty);
      if (finalScore > currentHighScore) {
        saveHighScore(currentDifficulty, finalScore);
        setHighScores(getHighScores());
      }
    }

    if (gameCleanup) {
      gameCleanup();
      gameCleanup = null;
    }
    clearScore();
    setShowHomeScreen(true);
    setShowGameOver(false);
    setBombCount(null);
  }

  return (
    <div class={styles.App}>
      <Show when={showHomeScreen()} fallback={
        <div id="game-container">
          <div id="header">
            <h1>BITMAN</h1>
            <p class={styles.deployTime}>Deployed: {formatDeployTime(DEPLOY_TIME)}</p>
          </div>
          <div id="canvas-container"></div>
          <div id="score-container">
            <p>
              high score: {getHighScoreForDifficulty(bombCount())}
              <br />
              score: {score()}
            </p>
          </div>
          <Show when={showGameOver()}>
            <div class={styles.gameOverOverlay} onClick={returnToHome}>
              <div class={styles.gameOverContent}>
                <h1 class={styles.gameOverTitle}>GAME OVER</h1>
                <p class={styles.gameOverSubtitle}>Click to continue</p>
              </div>
            </div>
          </Show>
        </div>
      }>
        <div class={styles.homeScreen}>
          <div class={styles.homeScreenContent}>
            <h1 class={styles.title}>BITMAN</h1>
            <p class={styles.deployTime}>Deployed: {formatDeployTime(DEPLOY_TIME)}</p>
            <h2 class={styles.subtitle}>Select Difficulty</h2>
            <div class={styles.difficultyButtons}>
              <button 
                class={styles.difficultyButton} 
                onClick={() => startGame(2)}
              >
                Easy
                <span class={styles.bombCount}>2 bombs</span>
              </button>
              <button 
                class={styles.difficultyButton} 
                onClick={() => startGame(3)}
              >
                Medium
                <span class={styles.bombCount}>3 bombs</span>
              </button>
              <button 
                class={styles.difficultyButton} 
                onClick={() => startGame(5)}
              >
                Hard
                <span class={styles.bombCount}>5 bombs</span>
              </button>
            </div>
            <div class={styles.highScoresContainer}>
              {getHighScoreForDifficulty(2) > 0 && (
                <p class={styles.highScoreDisplay}>Easy High: {getHighScoreForDifficulty(2)}</p>
              )}
              {getHighScoreForDifficulty(3) > 0 && (
                <p class={styles.highScoreDisplay}>Medium High: {getHighScoreForDifficulty(3)}</p>
              )}
              {getHighScoreForDifficulty(5) > 0 && (
                <p class={styles.highScoreDisplay}>Hard High: {getHighScoreForDifficulty(5)}</p>
              )}
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default App;
