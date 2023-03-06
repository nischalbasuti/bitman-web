import type { Component } from 'solid-js';

import styles from './App.module.css';
import still from './game_assets/bitman/default/still.png'
import left from './game_assets/bitman/default/moving_left.png'
import right from './game_assets/bitman/default/moving_right.png'

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={still} alt="logo" />
        <span>
          <img src={left} alt="logo" /> BITMAN <img src={right} alt="logo" />
        </span>
        <img src={still} alt="logo" />
        <canvas
          id="renderCanvas"
          width={window.innerWidth - 40}
          height={window.innerHeight - window.innerHeight/4}
          style="border:1px solid #000000; margin: 10px;">
        </canvas>
      </header>
    </div>
  );
};

export default App;
