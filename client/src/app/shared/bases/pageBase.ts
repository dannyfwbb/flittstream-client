import { Directive, OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Note: while extending this class consider implementing destroyHook instead of using ngOnDestroy
 * otherwise, you are responsible for calling super.ngOnDestroy() or triggering destroy$ subject yourself
 */
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class PageBase implements OnDestroy {
  protected destroy$ = new Subject<void>();

  // todo: seems useless. remove maybe?
  private isDestroy = true;

  constructor() {
    // yes, it's empty
  }

  /**
   * WARNING! Place as last pipe() operator!
   * @see {@link https://ncjamieson.com/avoiding-takeuntil-leaks/|Avoid takeUntil leaks}
   */
  protected untilDestroy<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil<T>(this.destroy$);
  }

  ngOnDestroy(): void {
    if (this.isDestroy) {
      if (!this.destroy$.isStopped) {
        this.destroy$.next();
        this.destroy$.complete();
      }
    }
    this.destroyHook();
  }

  protected abstract destroyHook(): void;
}
