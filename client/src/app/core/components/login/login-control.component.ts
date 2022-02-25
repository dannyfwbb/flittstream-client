import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../shared/bases/base.component';
import { UserLogin } from '../../../shared/models/user/user-login.model';
import { AlertService, MessageSeverity } from '../../../shared/services/alert.service';
import { Utilities } from '../../../shared/services/utilities';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-login-control',
  templateUrl: './login-control.component.html',
  styleUrls: ['./login-control.component.scss']
})
export class LoginControlComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) private form: NgForm;
  @Input() isModal = false;
  @Output() enterKeyPress = new EventEmitter();

  isLoading = false;
  modalClosedCallback: () => void;

  loginForm: FormGroup;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    super();
    this.buildForm();
  }

  ngOnInit(): void {
    this.loginForm.setValue({
      userName: '',
      password: '',
      rememberMe: this.authService.rememberMe
    });
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: ''
    });
  }

  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }

  closeModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }

  getUserLogin(): UserLogin {
    const formModel = this.loginForm.value;
    return new UserLogin(formModel.userName, formModel.password, formModel.rememberMe);
  }

  login() {
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (!this.loginForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Attempting login...');

    this.authService.loginWithPassword(this.getUserLogin()).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.alertService.stopLoadingMessage();
        this.isLoading = false;
        this.alertService.showMessage('Login', `Welcome ${user.userName}!`, MessageSeverity.success);
        this.closeModal();
      },
      error: (error) => {
        this.alertService.stopLoadingMessage();
        const errorMessage = Utilities.getHttpResponseMessage(error);
        if (errorMessage) {
          this.alertService.showStickyMessage('Unable to login', errorMessage, MessageSeverity.error, error);
        } else {
          this.alertService.showStickyMessage(
            'Unable to login', 'An error occurred, please try again later.\nError: ' + Utilities.getResponseBody(error),
            MessageSeverity.error,
            error
          );
        }

        this.isLoading = false;
      }
    })
  }

  enterKeyDown() {
    this.enterKeyPress.emit();
  }
}
