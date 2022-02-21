import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginControlComponent } from './login-control.component';


@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login-dialog.component.html',
  styleUrls: ['login-dialog.component.scss']
})
export class LoginDialogComponent implements AfterViewInit {
    @ViewChild(LoginControlComponent, { static: true }) loginControl: LoginControlComponent;

    constructor(
        public dialogRef: MatDialogRef<LoginDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: unknown) { }

    ngAfterViewInit(): void {
      this.loginControl.modalClosedCallback = () => this.dialogRef.close(true);
    }

    onCancel(): void {
      this.dialogRef.close(false);
    }
}
