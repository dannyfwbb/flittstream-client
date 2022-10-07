import { SimpleChange, SimpleChanges } from '@angular/core';

export type ObjectSafe = Record<string, unknown>;

export type Enum<E> = {
  [id: string]: E | string;
  [nu: number]: string;
};

export type ComponentChanges<TComp> = SimpleChanges & {
  [K in keyof TComp]: TComp[K] extends ((...args: unknown[]) => unknown) | (new (...args: unknown[]) => unknown) ? never : SimpleChange;
};
