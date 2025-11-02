/**
 * Event Emitter simple para eventos globales de la app
 */
type EventHandler = (...args: any[]) => void;

export class SimpleEventEmitter {
  private events: Map<string, EventHandler[]> = new Map();

  /**
   * Registrar un listener para un evento
   */
  on(event: string, handler: EventHandler): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(handler);
  }

  /**
   * Eliminar un listener de un evento
   */
  off(event: string, handler: EventHandler): void {
    const handlers = this.events.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emitir un evento
   */
  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  /**
   * Limpiar todos los listeners
   */
  clear(): void {
    this.events.clear();
  }
}
