import type { Component } from 'solid-js';

import styles from './App.module.css';
import still from './game_assets/bitman/default/still.png'
import left from './game_assets/bitman/default/moving_left.png'
import right from './game_assets/bitman/default/moving_right.png'

const App: Component = () => {
  console.log(right);
  return (
    <div class={styles.App}>
      <div id="canvas-container"></div>
    </div>
  );
};

export default App;
