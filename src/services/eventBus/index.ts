import { EventEmitter } from "events";
import { Event, EventPayloads } from "./events";
import { Logger } from "winston";

export * from "./events";

export declare interface EventBus extends EventEmitter {
  on<T extends Event>(
    eventName: T,
    listener: (payload: EventPayloads[T]) => void
  ): this;

  emit<T extends Event>(eventName: T, payload: EventPayloads[T]): boolean;
  _emit<T extends Event>(eventName: T, payload: EventPayloads[T]): boolean;
}

export class EventBus extends EventEmitter {
  constructor(logger: Logger) {
    super();
    this._emit = this.emit;
    this.emit = <T extends Event>(eventName: T, payload: EventPayloads[T]) => {
      logger.debug(eventName, payload);
      return this._emit.call(this, eventName, payload);
    };
  }
}
