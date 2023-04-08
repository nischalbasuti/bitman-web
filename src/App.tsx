import { Component, createSignal, onMount } from 'solid-js';

import styles from './App.module.css';
import { initGame } from './game/game';

const App: Component = () => {
  const [score, setScore] = createSignal(0);
  const [highScore, setHighScore] = createSignal(0);

  const increamentScore = () => {
    setScore(score() + 1);

    if (score() > highScore()) {
      setHighScore(score());
    }

    return score();
  }

  const clearScore = () => {
    const lastScore = score();

    setScore(0);

    return lastScore;
  }

  onMount(() => {
    const canvasContainer = document.querySelector("#canvas-container");
    if (canvasContainer) initGame(increamentScore, clearScore, canvasContainer);
  })

  return (
    <div class={styles.App}>
      <div id="game-container">
        <div id="header">
          <h1>BITMAN</h1>
        </div>
        <div id="canvas-container"></div>
        <div id="score-container">
          <p>
            high score: {highScore}
            <br />
            score: {score()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
