import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FSC_DOCUMENT } from '../injection-tokens';

@Injectable({ providedIn: 'root' })
export class ConfigurationApiService {
  constructor(
    backend: HttpBackend,
    @Inject(FSC_DOCUMENT) document: Document,
  ) {
    this.client = new HttpClient(backend);
    this.baseHref = this.getBaseUrl(document) || '/';
  }

  private readonly baseHref: string;
  private readonly client: HttpClient;
  private readonly headers = new HttpHeaders({
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  private getBaseUrl(document: Document): string | null {
    const href = document.getElementsByTagName('base')?.item(0)?.href;
    if (href == null) {
      return null;
    }

    return href[href.length - 1] === '/'
      ? href
      : href + '/';
  }

  private prepareUrl(url: string): string {
    url = url[0] === '/'
      ? url.substring(1)
      : url;
    return this.baseHref + url;
  }

  get<T>(url: string): Observable<T> {
    url = this.prepareUrl(url);
    return this.client.get<T>(url);
  }

  getNoCache<T>(url: string): Observable<T> {
    url = this.prepareUrl(url);
    return this.client.get<T>(url, { headers: this.headers });
  }
}
