import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceBase } from '../bases/base.api';
import { CustomHttpParams } from '../models/http/customHttpParams';
import { ConfigurationService } from '../services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class FilesApiService extends ApiServiceBase {
  constructor(
    private http: HttpClient,
    configuration: ConfigurationService,
  ) {
    super(configuration, '');
  }

  getImage(imageUrl: string, local: boolean): Observable<Blob> {
    const url = local ? imageUrl : `${this.straightUrl}${imageUrl}`;
    return this.http.get(url, { responseType: 'blob', params: new CustomHttpParams(true) });
  }
}
