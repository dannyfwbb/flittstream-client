import { Injectable, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  constructor(
    private router: Router,
  ) {
  }

  private readonly destroy$ = new Subject<void>();

  get isAuthenticated(): boolean {
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  signIn(): Observable<void> {
    return void 0;
  }

  signOut(): Observable<void> {
    return void 0;
  }

  get authorizationHeaderValue(): string {
    return `Bearer Test`;
  }

  removeCurrentUser(): void {
    return void 0;
  }

  goToUnauthorized(returnUrl?: string): void {
    this.router.navigateByUrl(this.getUnauthorizedUrlTree(returnUrl));
  }

  getUnauthorizedUrlTree(returnUrl?: string): UrlTree {
    let navExtras: NavigationExtras = void 0;
    if (returnUrl) {
      navExtras = { queryParams: { returnUrl } };
    }

    return this.router.createUrlTree(['/auth/login'], navExtras);
  }
}
