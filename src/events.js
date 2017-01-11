export class EventManager {

  listeners = [];

  constructor(logger) {
    this.logger = logger;
  }

  registerEventlistener(listener) {
    this.listeners.push(listener);
  }

  emit(eventName, payload) {
    this.listeners.forEach(listener => {
      if (listener.eventListener && typeof listener.eventListener === 'function') {
        listener.eventListener(eventName, payload);
      }
    });
  }

  refreshAllGetters() {
    this.listeners.forEach(listener => {
      if (listener.refreshAllGetters && typeof listener.refreshAllGetters === 'function') {
        listener.refreshAllGetters();
      }
    });
  }

}
