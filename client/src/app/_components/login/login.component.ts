import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/bases/base.component';
import { UserLogin } from '../../shared/models/user/user-login.model';
import { AuthService } from '../../shared/services/auth.service';
import { Utilities } from '../../shared/services/utilities';

@Component({
  selector: 'fsc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) private form: NgForm;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private ref: DynamicDialogRef) {
    super();
    this.buildForm();
  }

  loginForm: FormGroup;
  loading: boolean;

  ngOnInit(): void {
    this.loginForm.setValue({
      username: '',
      password: '',
      rememberMe: this.authService.rememberMe
    });
  }

  get valid(): boolean {
    return this.loginForm.valid;
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: ''
    });
  }

  login(): void {

    this.loading = true;

    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    this.authService.login(this.getUserLogin())
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      ).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary: 'Login', detail: `Welcome!`});
          this.ref.close();
        },
        error: (error) => {
          if (Utilities.checkNoNetwork(error)) {
            this.messageService.add({severity:'error', summary: Utilities.noNetworkMessageCaption, detail: Utilities.noNetworkMessageDetail});
          } else {
            const errorMessage = Utilities.getHttpResponseMessage(error);
            if (errorMessage) {
              this.messageService.add({severity:'error', summary: 'Unable to login', detail: this.mapLoginErrorMessage(errorMessage)});
            } else {
              this.messageService.add({
                severity:'error',
                summary: 'Unable to login',
                detail: 'An error occurred, please try again later.\nError: ' + Utilities.getResponseBody(error)
              });
            }
          }
        }
      });
  }

  mapLoginErrorMessage(error: string) {
    if (error == 'invalid_username_or_password') {
      return 'Invalid username or password';
    }

    if (error == 'invalid_grant') {
      return 'This account has been disabled';
    }

    return error;
  }

  getUserLogin(): UserLogin {
    const formModel = this.loginForm.value;
    return new UserLogin(formModel.username, formModel.password, formModel.rememberMe);
  }
}
