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
  #tiltAmount: number = 0; // Stores the tilt amount for acceleration

  static getInstance(): InputState {
    if (!InputState.#instance) InputState.#instance = new InputState();

    return InputState.#instance;
  }
  constructor() {
    if (InputState.#instance) throw TypeError("Can only create one instance");

    this.#currentState = InputStateType.None;
    this.#tiltAmount = 0;
  }

  getState() {
    return this.#currentState;
  }

  getTiltAmount(): number {
    return this.#tiltAmount;
  }

  setState(state: InputStateType, tiltAmount: number = 0) {
    this.#currentState = state;
    this.#tiltAmount = tiltAmount;
  }
}

