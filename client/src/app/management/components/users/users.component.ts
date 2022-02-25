import { Component, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../shared/bases/base.component';
import { PrimengTableHelper } from '../../../shared/helpers/primengTableHelper';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'fsc-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent {
  @ViewChild('datatable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  constructor(private usersService: UsersService, public tableHelper: PrimengTableHelper) {
    super();
  }

  getUsers(event: LazyLoadEvent) {
    if (this.tableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);

      return;
    }

    this.tableHelper.showLoadingIndicator();

    const maxResultCount = this.tableHelper.getMaxResultCount(this.paginator, event);
    const skipCount = this.tableHelper.getSkipCount(this.paginator, event);

    this.usersService.getUsers(maxResultCount, skipCount).pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => {
        this.tableHelper.totalRecordsCount = 102;
        this.tableHelper.records = users;
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

  createUser(): void {
    //
  }

  exportToExcel(): void {
    //
  }

  filter($event: Event): void {
    //rewrite to server side
    const element = $event.currentTarget as HTMLInputElement
    this.dataTable.filterGlobal(element.value, 'contains')
  }
}
