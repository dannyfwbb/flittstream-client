import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, forkJoin, of as just, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../shared/bases/base.component';
import { DialogResult } from '../../../../shared/models/dialog/dialogResult';
import { Permission } from '../../../../shared/models/user/permission.model';
import { Utilities } from '../../../../shared/services/utilities';
import { RoleContext } from '../../../models/roles/role-context.model';
import { RoleCreateContext } from '../../../models/roles/role-create-context.model';
import { RoleEditContext } from '../../../models/roles/role-edit-context.model';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'fsc-role-editor',
  templateUrl: './role-editor.component.html',
  styleUrls: ['./role-editor.component.scss']
})
export class RoleEditorComponent extends BaseComponent implements OnInit {
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

  roleForm: FormGroup;
  loading = true;
  permissionsChanged = false;

  role = new RoleContext();
  permissionsTree: TreeNode[];
  selectedPermissions: TreeNode[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  get name() {
    return this.roleForm.get('name');
  }

  get description() {
    return this.roleForm.get('description');
  }

  buildForm(): void {
    this.roleForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: '',
    });
  }

  loadData(): void {
    const permissionsRequest$ = this.service.getPermissions();
    const request$ = forkJoin([permissionsRequest$, this.isNewRole ? just(null) : this.service.getRole(this.config.data.id)]);

    request$.pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (([permissions, role]) => {
        this.permissionsTree = this.permissionsFlatToTree(permissions);
        this.role = role ?? new RoleContext();
        if (role) {
          this.checkNode(this.permissionsTree, role.permissions.map((permission) => permission.value));
          this.roleForm.setValue({
            name: role.name,
            description: role.description,
          });
        }
      })
    });
  }

  get isNewRole(): boolean {
    return this.config.data?.id ? false : true;
  }

  get canSave(): boolean {
    return (this.roleForm.valid && this.roleForm.dirty) || this.permissionsChanged;
  }

  save(): void {
    this.loading = true;

    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (this.isNewRole) {
      this.saveNew();
    } else {
      this.saveEdited();
    }
  }

  saveNew(): void {
    const value = this.roleForm.value;

    const role = {
      name: value.name,
      description: value.description,
      permissions: this.selectedPermissions.map((permission) => permission.data),
    } as RoleCreateContext;

    this.service.createNewRole(role)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      ).subscribe({
        next: ((created: RoleContext) => {
          this.messageService.add({severity:'success', summary: 'Role editor', detail: `Role ${role.name} created!`});
          this.ref.close({ result: DialogResult.Applied, data: created });
        }),
        error: ((error) => {
          const errorMessage = Utilities.getHttpResponseMessage(error);
          this.messageService.add({severity:'error', summary: 'Unable to manipulate role', detail: errorMessage});
        })
      });
  }

  saveEdited(): void {
    const value = this.roleForm.value;

    const role = {
      id: this.role.id,
      name: value.name,
      description: value.description,
      permissions: this.selectedPermissions.filter((permission) => permission.leaf).map((permission) => permission.data),
    } as RoleEditContext;

    this.service.updateRole(role)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      ).subscribe({
        next: ((created: RoleContext) => {
          this.messageService.add({severity:'success', summary: 'Role editor', detail: `Role ${role.name} saved!`});
          this.ref.close({ result: DialogResult.Applied, data: created });
        }),
        error: ((error) => {
          const errorMessage = Utilities.getHttpResponseMessage(error);
          this.messageService.add({severity:'error', summary: 'Unable to manipulate role', detail: errorMessage});
        })
      });
  }

  delete(event: Event): void {
    this.confirmationService.confirm({
      target: event.target,
      message: `Are you sure that you want to delete role ${this.role.name}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;

        this.service.deleteRole(this.config.data.id)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => this.loading = false)
          ).subscribe({
            next: (() => {
              this.messageService.add({severity:'success', summary: 'Role editor', detail: `Role ${this.role.name} deleted!`});
              this.ref.close({ result: DialogResult.Deleted, data: this.role.id });
            }),
            error: ((error) => {
              const errorMessage = Utilities.getHttpResponseMessage(error);
              this.messageService.add({severity:'error', summary: 'Unable to delete role', detail: errorMessage});
            })
          })
      },
      reject: () => {
        //reject action
      }
    });
  }

  private permissionsFlatToTree(permissions: Permission[]): TreeNode[] {
    const result: TreeNode[] = [];
    const groups = [...new Set(permissions.map((permission) => permission.groupName))];

    groups.forEach((group) => {
      const children: TreeNode[] = permissions.filter((permission) => permission.groupName === group).map((value) => {
        return { label: value.name, data: value.value, leaf: true }
      });
      result.push({ label: group, expandedIcon: 'pi pi-folder-open', collapsedIcon: 'pi pi-folder', children: children, leaf: false });
    });

    return result;
  }

  nodeAction() {
    this.permissionsChanged = true;
  }

  checkNode(nodes:TreeNode[], str:string[]) {
    for(let i=0 ; i < nodes.length ; i++) {
      if(!nodes[i].leaf && nodes[i].children[0].leaf) {
        for(let j=0 ; j < nodes[i].children.length ; j++) {
          if(str.includes(nodes[i].children[j].data)) {
            if(!this.selectedPermissions.includes(nodes[i].children[j])){
              this.selectedPermissions.push(nodes[i].children[j]);
            }
          }
        }
      }
      if (nodes[i].leaf) {
        return;
      }
      this.checkNode(nodes[i].children, str);
      const count = nodes[i].children.length;
      let c = 0;
      for(let j=0 ; j < nodes[i].children.length ; j++) {
        if(this.selectedPermissions.includes(nodes[i].children[j])) {
          c++;
        }
        if(nodes[i].children[j].partialSelected) nodes[i].partialSelected = true;
      }
      // eslint-disable-next-line no-empty
      if(c == 0) {}
      else if(c == count) {
        nodes[i].partialSelected = false;
        if(!this.selectedPermissions.includes(nodes[i])){
          this.selectedPermissions.push(nodes[i]);
        }
      }
      else {
        nodes[i].partialSelected = true;
      }
    }
  }
}

