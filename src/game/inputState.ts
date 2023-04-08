export enum InputStateType {
  None,
  Left,
  Right,
  Up,
  Down,
}

export default class InputState {
  static #instance: InputState | null = null;

  #currentState: InputStateType;

  static getInstance(): InputState {
    if (!InputState.#instance) InputState.#instance = new InputState();

    return InputState.#instance;
  }
  constructor() {
    if (InputState.#instance) throw TypeError("Can only create one instance");

    this.#currentState = InputStateType.None;
  }

  getState() {
    return this.#currentState;
  }

  setState(state: InputStateType) {
    this.#currentState = state;
  }
}

