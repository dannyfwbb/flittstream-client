import { HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  HttpExecutionErrorData,
  HttpResponseMessage,
  HttpResponseType,
  HttpServerErrorData
} from '../models/http/http';
import { Enum } from './common';

export class Utilities {
  static readonly accessDeniedApiUrl = '/account/accessdenied';

  static cookies = {
    getItem: (sKey: string | number | boolean): string => {
      const keyPattern = Utilities.prepareForRegexPattern(sKey);
      const pattern = `(?:(?:^|.*;)\\s*${keyPattern}\\s*=\\s*([^;]*).*$)|^.*$`;
      return decodeURIComponent(document.cookie.replace(new RegExp(pattern), '$1'))
        || null;
    },

    setItem: (sKey: string, sValue: string, vEnd: number | string | Date, sPath: string, sDomain: string, bSecure: boolean): boolean => {
      if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }

      let sExpires = '';

      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : '; max-age=' + vEnd;
            break;
          case String:
            sExpires = '; expires=' + vEnd;
            break;
          case Date:
            sExpires = '; expires=' + (vEnd as Date).toUTCString();
            break;
        }
      }

      document.cookie = encodeURIComponent(sKey)
        + '='
        + encodeURIComponent(sValue)
        + sExpires
        + (sDomain ? '; domain=' + sDomain : '')
        + (sPath ? '; path=' + sPath : '')
        + (bSecure ? '; secure' : '');
      return true;
    },

    removeItem: (sKey: string, sPath: string, sDomain: string): boolean => {
      if (!sKey) {
        return false;
      }

      document.cookie = encodeURIComponent(sKey)
        + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        + (sDomain ? '; domain=' + sDomain : '')
        + (sPath ? '; path=' + sPath : '');
      return true;
    },

    hasItem: (sKey: string): boolean => {
      const keyPattern = Utilities.prepareForRegexPattern(sKey);
      const pattern = `(?:^|;\\s*)${keyPattern}\\s*=`;
      return new RegExp(pattern).test(document.cookie);
    },

    keys: (): string[] => {
      // eslint-disable-next-line no-useless-backreference
      const aKeys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '')
        .split(/\s*(?:=[^;]*)?;\s*/);

      for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    }
  };

  private static prepareForRegexPattern = (value: string | number | boolean): string => {
    return encodeURIComponent(value).replace(/[-.+*]/g, '\\$&');
  };

  static getHttpResponseMessages(response: HttpResponseBase): Observable<HttpResponseMessage[] | null> {
    return from(this.getHttpResponseMessagesAsync(response)).pipe(
      map((messages) => {
        if (messages == null) { return null; }
        return Array.isArray(messages) ? messages : [messages];
      }),
    );
  }

  static async getHttpResponseMessagesAsync(response: HttpResponseBase): Promise<HttpResponseMessage | HttpResponseMessage[] | null> {
    if (!(response instanceof HttpResponseBase)) {
      return null;
    }

    switch (response.status) {
      case 0: {
        return {
          type: HttpResponseType.noNetwork,
        };
      }
      case 401: {
        return {
          type: HttpResponseType.notAuthenticated,
        };
      }
      case 404: {
        const messageArgs: Record<string, unknown> = {};
        if (response.url) {
          messageArgs['url'] = response.url;
        }
        return {
          type: HttpResponseType.notFound,
          messageArgs: messageArgs,
        };
      }
    }

    if (this.checkAccessDenied(response)) {
      return {
        type: HttpResponseType.accessDenied,
      };
    }

    let responseBody = this.getResponseBody(response);

    if (responseBody instanceof Blob) {
      const text = await responseBody.text();
      responseBody = this.JsonTryParse(text) ?? text;
    }

    if (responseBody != null && typeof responseBody === 'object') {
      const validationErrors = this.getExecutionErrorMessages(responseBody);
      if (validationErrors != null) {
        return validationErrors;
      }

      const intlErrorMessage = this.getIntlServerErrorMessage(responseBody as HttpServerErrorData);
      if (intlErrorMessage != null) {
        return intlErrorMessage;
      }

      const responseBodyObj: {[index: string]: any} = responseBody;

      for (const key in responseBody) {
        if (!key.toLowerCase().includes('error')) { continue; }

        const prop = responseBodyObj[key];
        if (typeof prop !== 'string') { continue; }

        return {
          type: HttpResponseType.error,
          message: `${prop}`,
        };
      }
    }

    // here we've got `something`. let's try to return it
    const type = response instanceof HttpErrorResponse
      ? HttpResponseType.error
      : HttpResponseType.common;
    let msg: string = null;
    if (typeof responseBody === 'string') {
      msg = responseBody;
    } else if (type === HttpResponseType.error) {
      msg = `${response.status}: ${response.statusText}`;
    }

    return msg == null ? null : {
      type: type,
      message: msg,
    };
  }

  static getExecutionErrorMessages(response: unknown): HttpResponseMessage[] | null {
    if (response == null || typeof response !== 'object') { return null; }

    const validationResponse = response as { errors: HttpExecutionErrorData[]; };
    if (!('errors' in validationResponse) || !Array.isArray(validationResponse.errors)) { return null; }

    const messages = validationResponse.errors
      .filter((e) => e.message != null)
      .map<HttpResponseMessage>((e) => ({
        type: HttpResponseType.error,
        message: e.message,
      }));
    return messages;
  }

  static getIntlServerErrorMessage(data: HttpServerErrorData | null): HttpResponseMessage | null {
    if (data == null || !('status' in data && 'title' in data)) { return null; }

    const message: HttpResponseMessage = {
      type: HttpResponseType.error,
      title: data.title,
      message: data.detail || '',
    };

    return message;
  }

  static getResponseBody(response: HttpResponseBase | null): string | unknown {
    if (response == null) { return null; }

    if (response instanceof HttpResponse) {
      const result = response.body;
      if (result != null) { return result; }
    } else if (response instanceof HttpErrorResponse) {
      const result = response.error || response.message;
      if (result != null) { return result; }
    }

    return response.statusText;
  }

  static checkAccessDenied(response: HttpResponseBase | null): boolean {
    if (response == null) {
      return false;
    }

    return response.status === 403
      || response.status === 200 && response.url?.toLowerCase().indexOf(this.accessDeniedApiUrl) >= 0;
  }

  static JsonTryParse<T>(value: string): T | null | undefined {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      if (value === 'undefined') {
        return void 0;
      }
      return null;
    }
  }

  static copy<T>(value: T): T {
    return value == null ? value : JSON.parse(JSON.stringify(value)) as T;
  }

  static getFilterRegexes(filter: string): RegExp[] {
    const fragments = filter
      ?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex special chars. MDN version
      .split(/\s+/)
      .filter((val, idx, self) => val && self.indexOf(val) === idx); // get distinct non-empty parts

    const filterExp = fragments?.map((f) => new RegExp(f, 'i'));

    return filterExp;
  }

  static filterHierarchy<T>(
    items: T[],
    getChildren: (item: T) => T[],
    getFields: (item: T) => string[],
    filterExp: RegExp[]
  ): T[] {
    const filteredItems: T[] = [];

    for (const item of items) {
      const children = getChildren(item);
      let anyChildMatched = false;

      if (children?.length) {
        const filteredChildren = this.filterHierarchy(children, getChildren, getFields, filterExp);
        filteredItems.push(...filteredChildren);
        anyChildMatched = filteredChildren.length > 0;
      }

      if (anyChildMatched || this.checkFilter(getFields(item), filterExp)) {
        filteredItems.push(item);
      }
    }

    return filteredItems;
  }

  static checkFilter(fields: string[], filterExp: RegExp[]): boolean {
    return filterExp == null
      || filterExp.every((regex) => fields.some((field) => regex.test(field)));
  }

  static getEnumNumberKeys<T>(en: Enum<T>): number[] {
    return Object.keys(en)
      .map((key) => Number(key))
      .filter((key) => !isNaN(key));
  }

  static range(start: number, end: number): number[] {
    const result = [];
    const reverse = start > end;
    if (!reverse) {
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      for (let i = start; i >= end; i--) {
        result.push(i);
      }
    }

    return result;
  }
}
