export const INPUT_STATES = {
  none: 'none',
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',
}

export default class InputState {
  static #instance: InputState | null = null;

  #currentState;

  static getInstance(): InputState {
    if (!InputState.#instance) InputState.#instance = new InputState();

    return InputState.#instance;
  }
  constructor() {
    if (InputState.#instance) throw TypeError("Can only create one instance");

    this.#currentState = INPUT_STATES.none;
  }

  getState() {
    return this.#currentState;
  }

  setState(state: string) {
    this.#currentState = state;
  }
}

