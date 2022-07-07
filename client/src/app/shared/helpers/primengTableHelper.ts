import { Injectable } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class PrimengTableHelper {
  predefinedRecordsCountPerPage = [5, 10, 25, 50, 100, 250, 500];
  defaultRecordsCountPerPage = 10;
  isResponsive = true;
  resizableColumns = true;
  totalRecordsCount = 0;
  records: unknown[];
  selected: unknown[];
  isLoading = false;

  showLoadingIndicator(): void {
    setTimeout(() => {
      this.isLoading = true;
    }, 0);
  }

  hideLoadingIndicator(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 0);
  }

  getSorting(table: Table): string {
    let sorting = '';

    if (table.sortMode === 'multiple') {
      if (table.multiSortMeta) {
        for (let i = 0; i < table.multiSortMeta.length; i++) {
          const element = table.multiSortMeta[i];
          if (i > 0) {
            sorting += ',';
          }
          sorting += element.field;
          if (element.order === 1) {
            sorting += ' ASC';
          } else if (element.order === -1) {
            sorting += ' DESC';
          }
        }
      }
    } else if (table.sortField) {
      sorting = table.sortField;
      if (table.sortOrder === 1) {
        sorting += ' ASC';
      } else if (table.sortOrder === -1) {
        sorting += ' DESC';
      }
    }

    return sorting;
  }

  getMaxResultCount(paginator: Paginator, event: LazyLoadEvent): number {
    if (paginator.rows) {
      return paginator.rows;
    }

    if (!event) {
      return 0;
    }

    return event.rows;
  }

  getPage(paginator: Paginator): number {
    const page = paginator.getPage();

    if (!page) {
      return 1;
    }

    return page + 1;
  }

  getSkipCount(paginator: Paginator, event: LazyLoadEvent): number {
    if (paginator.first) {
      return paginator.first;
    }

    if (!event) {
      return 0;
    }

    return event.first;
  }

  shouldResetPaging(event: LazyLoadEvent): boolean {
    if (!event) {
      return true;
    }

    return false;
  }
}
