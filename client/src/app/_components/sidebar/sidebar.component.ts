import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/bases/base.component';
import { AuthService } from '../../shared/services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [DialogService]
})
export class SidebarComponent extends BaseComponent {
  constructor(
    public dialogService: DialogService,
    private authService: AuthService,
    public router: Router) {
    super();
  }

  get isAuthorized(): boolean {
    return this.authService.isLoggedIn;
  }

  login(): void {
    const ref = this.dialogService.open(LoginComponent, {
      header: 'Login',
      width: '30%',
      height: '45%',
    });

    ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (_result) => {
        //
      },
    });
  }

  refresh(): void {
    this.authService.refreshLogin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
