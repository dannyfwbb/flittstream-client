import { Component, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../shared/bases/base.component';
import { PrimengTableHelper } from '../../../shared/helpers/primengTableHelper';
import { DialogResult } from '../../../shared/models/dialog/dialogResult';
import { PermissionService } from '../../../shared/services/permission.service';
import { UserContext } from '../../models/users/user-context.model';
import { UsersContext } from '../../models/users/users-context.model';
import { AccountService } from '../../services/account.service';
import { UserEditorComponent } from './user-editor/user-editor.component';

@Component({
  selector: 'fsc-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DialogService]
})
export class UsersComponent extends BaseComponent {
  @ViewChild('datatable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  constructor(
    private accountService: AccountService,
    public tableHelper: PrimengTableHelper,
    private dialogService: DialogService,
    private permissionService: PermissionService,) {
    super();
  }

  selectedUsers: UserContext[];
  filterText: string;

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  override ngOnDestroy(): void {
    this.tableHelper.records = [];
    this.emitDestroySubject();
  }

  getUsers(event?: LazyLoadEvent) {
    if (this.tableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);

      return;
    }

    this.tableHelper.showLoadingIndicator();

    const maxResultCount = this.tableHelper.getMaxResultCount(this.paginator, event);
    const page = this.tableHelper.getPage(this.paginator);

    this.accountService.getUsers(page, maxResultCount, this.filterText).pipe(takeUntil(this.destroy$)).subscribe({
      next: (context: UsersContext) => {
        this.tableHelper.totalRecordsCount = context.totalCount;
        this.tableHelper.records = context.users;
        this.tableHelper.hideLoadingIndicator();
      }
    });
  }

  getRolesAsString(roles: string[]): string {
    let roleNames = '';

    for (let j = 0; j < roles.length; j++) {
      if (roleNames.length) {
        roleNames = roleNames + ', ';
      }
      roleNames = roleNames + roles[j];
    }

    return roleNames;
  }

  addUser(): void {
    const ref = this.dialogService.open(UserEditorComponent, {
      header: 'Add new user',
      width: '30%',
      height: '85%',
    });

    ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: ((result) => {
        if (!result) return;

        switch (result.result) {
          case DialogResult.Applied:
            this.tableHelper.records.push(result.data);
            break;
        }
      })
    });
  }

  editUser(id: string): void {
    if (!this.permissionService.isGranted('users.edit')) return;

    const ref = this.dialogService.open(UserEditorComponent, {
      header: 'Edit user',
      width: '30%',
      height: '85%',
      data: {
        id: id,
      },
    });

    ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: ((result) => {
        if (!result) return;

        switch (result.result) {
          case DialogResult.Applied:
            this.tableHelper.records[(this.tableHelper.records as UserContext[])
              .findIndex((value) => value.id === result.data.id)] = result.data;
            break;
          case DialogResult.Deleted:
            this.tableHelper.records.splice((this.tableHelper.records as UserContext[])
              .findIndex((value) => value.id === result.data), 1);
            break;
        }
      })
    });
  }

  filter($event: Event): void {
    const element = $event.currentTarget as HTMLInputElement;
    this.filterText = element.value;
  }
}
