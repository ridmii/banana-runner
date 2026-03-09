//simple event bus used to decouple game logic and UI
class GameEvents {
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => cb(data));
    }
  }
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}
export const gameEvents = new GameEvents();
