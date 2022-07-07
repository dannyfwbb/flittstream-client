import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../shared/api/base.api';
import { ConfigurationService } from '../../shared/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService extends ApiBaseService {
  private readonly _userMetadataUrl: string = '/api/account/users/me/metadata';

  get usersMetadataUrl() { return this.configurations.baseUrl + this._userMetadataUrl; }

  constructor(private configurations: ConfigurationService, private http: HttpClient) {
    super();
  }

  getUserMetadata<T>(): Observable<T> {
    const endpointUrl = this.usersMetadataUrl;
    return this.http.get<T>(endpointUrl);
  }
}
