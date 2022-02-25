import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { LoginDialogComponent } from '../../core/components/login/login-dialog.component';
import { BaseComponent } from '../../shared/bases/base.component';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BaseComponent {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    public router: Router) {
    super();
  }

  get isAuthorized(): boolean {
    return this.authService.isLoggedIn;
  }

  login(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, { minWidth: 600 });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
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
  }
}
