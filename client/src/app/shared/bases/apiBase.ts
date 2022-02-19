import { ConfigurationService } from '../services/configuration.service';

export abstract class ApiServiceBase<T extends ApiServiceReplacements = ApiServiceReplacements> {
  protected readonly GET_ALL = '/';
  protected readonly GET = '/%code%';
  protected readonly GET_FOR_EDIT = '/%code%/editor';
  protected readonly GET_FOR_CREATE = '/editor';
  protected readonly GET_FOR_CREATE_OR_EDIT = '/editor';

  protected readonly PUT_EDITED = '/%code%';
  protected readonly POST_CREATED = '/';
  protected readonly DELETE = '/%code%';

  protected readonly EXCEL_EXPORT = '/export'

  protected baseUrl: string;
  protected controllerPath: string;
  protected straightPath: string;

  protected get apiUrl(): string {
    return `${this.baseUrl}${this.controllerPath}`;
  }

  protected get straightUrl(): string {
    return `${this.straightPath}`;
  }

  constructor(configuration: ConfigurationService, controllerPath?: string) {
    this.baseUrl = configuration.settings.api.url;
    this.straightPath = configuration.settings.op.url;
    this.controllerPath = controllerPath || '';
  }

  protected apiMethodUrl(method: string, data?: T): string {
    return `${this.apiUrl}${this.replaceWithData(method, data)}`;
  }

  protected replaceWithData(str: string, data?: T): string {
    if (data == null) {
      return str;
    }

    return str.replace(/%(\w+)%/g, (_: string, field: string): string => {
      return `${(data[field] ?? '')}`;
    });
  }

  protected prepareNumbersForQuery(nums: number[]): string[] {
    return nums?.filter(Number.isSafeInteger).map((num) => num.toString());
  }
}

export interface ApiServiceReplacements {
  code?: number;
  orgCode?: number;
  parentOrgCode?: number;
}
