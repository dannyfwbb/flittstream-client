import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, forkJoin, of as just, Subscription, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../shared/bases/base.component';
import { DialogResult } from '../../../../shared/models/dialog/dialogResult';
import { Role } from '../../../../shared/models/user/role.model';
import { Utilities } from '../../../../shared/services/utilities';
import { EqualValidator } from '../../../../shared/validators/equal.validator';
import { RoleContext } from '../../../models/roles/role-context.model';
import { UserContext } from '../../../models/users/user-context.model';
import { UserCreateContext } from '../../../models/users/user-create-context.model';
import { UserEditContext } from '../../../models/users/user-edit-context.model';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'fsc-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) private form: NgForm;

  constructor(
    private config: DynamicDialogConfig,
    private service: AccountService,
    private formBuilder: FormBuilder,
    private ref: DynamicDialogRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    super();
    this.buildForm();
  }

  roles: RoleContext[] = [];
  user = new UserContext();

  userForm: FormGroup;
  loading = true;
  isChangePassword = false;

  private passwordWatcher: Subscription;

  ngOnInit(): void {
    this.loadData();
  }

  get username() {
    return this.userForm.get('username');
  }

  get email() {
    return this.userForm.get('email');
  }

  get locked() {
    return this.userForm.get('locked');
  }

  get password() {
    return this.userForm.get('password');
  }

  get currentPassword() {
    return this.password.get('currentPassword');
  }

  get newPassword() {
    return this.password.get('newPassword');
  }

  get confirmPassword() {
    return this.password.get('confirmPassword');
  }

  buildForm(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: this.formBuilder.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required, EqualValidator('newPassword')]],
      }),
      roles: [[], Validators.required],
      enabled: true,
      sendInvite: false,
      locked: false,
    });

    if (this.isNewUser) {
      this.isChangePassword = true;
      this.addNewPasswordValidators();
    } else {
      this.isChangePassword = false;
      this.newPassword.clearValidators();
      this.confirmPassword.clearValidators();
    }

    this.currentPassword.clearValidators();

    this.passwordWatcher = this.newPassword.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.confirmPassword.updateValueAndValidity());
  }

  loadData(): void {
    const rolesRequest$ = this.service.getRoles();
    const request$ = forkJoin([rolesRequest$, this.isNewUser ? just(null) : this.service.getUser(this.config.data.id)]);

    request$.pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (([roles, user]) => {
        this.roles = roles?.roles;
        this.user = user ?? new UserContext();
        if (user) {
          this.userForm.setValue({
            username: user.userName,
            email: user.email,
            password: {
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            },
            roles: user.roles.map((roleName) => roles.roles.find((role) => role.name === roleName)),
            enabled: user.isEnabled,
            sendInvite: false,
            locked: user.isLockedOut,
          });
        }
      })
    });
  }

  get isNewUser(): boolean {
    return this.config.data?.id ? false : true;
  }

  get canSave(): boolean {
    return this.userForm.valid && this.userForm.dirty;
  }

  get confirmedEmailChanged() {
    return this.user.emailConfirmed && this.email.value != this.user.email;
  }

  get usernameChanged() {
    return this.username.value != this.user.userName;
  }

  get isEditingSelf() {
    return this.service.currentUser ? this.user.id === this.service.currentUser : false;
  }

  public changePassword() {
    this.isChangePassword = true;
    this.addCurrentPasswordValidators();
    this.addNewPasswordValidators();
    this.newPassword.updateValueAndValidity();
    this.confirmPassword.updateValueAndValidity();
  }

  private addCurrentPasswordValidators() {
    this.currentPassword.setValidators(Validators.required);
  }

  private addNewPasswordValidators() {
    this.newPassword.setValidators([Validators.required]);
    this.confirmPassword.setValidators([Validators.required, EqualValidator('newPassword')]);
  }

  save(): void {
    this.loading = true;

    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (this.isNewUser) {
      this.saveNew();
    } else {
      this.saveEdited();
    }
  }

  saveNew(): void {
    const value = this.userForm.value;

    const user = {
      username: value.username,
      email: value.email,
      password: this.isChangePassword ? value.password.newPassword : null,
      roles: (value.roles as Role[]).map((value) => value.name),
      enabled: value.enabled,
      sendInvite: value.sendInvite,
    } as UserCreateContext;

    this.service.createNewUser(user)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      ).subscribe({
        next: ((created: UserContext) => {
          this.messageService.add({severity:'success', summary: 'User editor', detail: `User ${user.username} created!`});
          this.ref.close({ result: DialogResult.Applied, data: created });
        }),
        error: ((error) => {
          const errorMessage = Utilities.getHttpResponseMessage(error);
          this.messageService.add({severity:'error', summary: 'Unable to manipulate user', detail: errorMessage});
        })
      });
  }

  saveEdited(): void {
    const value = this.userForm.value;

    const user = {
      id: this.user.id,
      username: value.username,
      email: value.email,
      currentPassword: this.isChangePassword ? value.password.currentPassword : null,
      newPassword: this.isChangePassword ? value.password.newPassword : null,
      roles: (value.roles as Role[]).map((value) => value.name),
      enabled: value.enabled,
      sendInvite: value.sendInvite,
      locked: value.locked,
    } as UserEditContext;

    this.service.updateUser(user)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      ).subscribe({
        next: ((created: UserContext) => {
          this.messageService.add({severity:'success', summary: 'User editor', detail: `User ${user.username} saved!`});
          this.ref.close({ result: DialogResult.Applied, data: created });
        }),
        error: ((error) => {
          const errorMessage = Utilities.getHttpResponseMessage(error);
          this.messageService.add({severity:'error', summary: 'Unable to manipulate user', detail: errorMessage});
        })
      });
  }

  delete(event: Event): void {
    this.confirmationService.confirm({
      target: event.target,
      message: `Are you sure that you want to delete user ${this.user.userName}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;

        this.service.deleteUser(this.config.data.id)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => this.loading = false)
          ).subscribe({
            next: (() => {
              this.messageService.add({severity:'success', summary: 'User editor', detail: `User ${this.user.userName} deleted!`});
              this.ref.close({ result: DialogResult.Deleted, data: this.user.id });
            }),
            error: ((error) => {
              const errorMessage = Utilities.getHttpResponseMessage(error);
              this.messageService.add({severity:'error', summary: 'Unable to delete user', detail: errorMessage});
            })
          })
      },
      reject: () => {
        //reject action
      }
    });

  }
}
