import { Component, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../shared/bases/base.component';
import { PrimengTableHelper } from '../../../shared/helpers/primengTableHelper';
import { DialogResult } from '../../../shared/models/dialog/dialogResult';
import { RoleContext } from '../../models/roles/role-context.model';
import { RolesContext } from '../../models/roles/roles-context.model';
import { AccountService } from '../../services/account.service';
import { RoleEditorComponent } from './role-editor/role-editor.component';

@Component({
  selector: 'fsc-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  providers: [DialogService]
})
export class RolesComponent extends BaseComponent {
  @ViewChild('datatable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  constructor(
    private accountService: AccountService,
    public tableHelper: PrimengTableHelper,
    public dialogService: DialogService) {
    super();
  }

  selectedRoles: RoleContext[];
  filterText: string;

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  override ngOnDestroy(): void {
    this.tableHelper.records = [];
    this.emitDestroySubject();
  }

  getRoles(event?: LazyLoadEvent) {
    if (this.tableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);

      return;
    }

    this.tableHelper.showLoadingIndicator();

    const maxResultCount = this.tableHelper.getMaxResultCount(this.paginator, event);
    const page = this.tableHelper.getPage(this.paginator);

    this.accountService.getRoles(page, maxResultCount).pipe(takeUntil(this.destroy$)).subscribe({
      next: (context: RolesContext) => {
        this.tableHelper.totalRecordsCount = context.totalCount;
        this.tableHelper.records = context.roles;
        this.tableHelper.hideLoadingIndicator();
      }
    });
  }

  addRole(): void {
    const ref = this.dialogService.open(RoleEditorComponent, {
      header: 'Add new role',
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

  editRole(id: string): void {
    const ref = this.dialogService.open(RoleEditorComponent, {
      header: 'Edit role',
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
            this.tableHelper.records[(this.tableHelper.records as RoleContext[])
              .findIndex((value) => value.id === result.data.id)] = result.data;
            break;
          case DialogResult.Deleted:
            this.tableHelper.records.splice((this.tableHelper.records as RoleContext[])
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
