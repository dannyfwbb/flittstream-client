import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  private readonly destroySubject$ = new Subject<void>();
  protected readonly destroy$ = this.destroySubject$.asObservable();

  ngOnDestroy(): void {
    this.emitDestroySubject();
  }

  protected emitDestroySubject(): void {
    if (!this.destroySubject$.closed) {
      this.destroySubject$.next();
      this.destroySubject$.complete();
    }
  }
}
