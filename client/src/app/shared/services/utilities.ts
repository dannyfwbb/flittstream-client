import { HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Utilities {
  public static readonly captionAndMessageSeparator = ':';
  public static readonly noNetworkMessageCaption = 'No Network';
  public static readonly noNetworkMessageDetail = 'The server cannot be reached';
  public static readonly accessDeniedMessageCaption = 'Access Denied!';
  public static readonly accessDeniedMessageDetail = '';
  public static readonly notFoundMessageCaption = 'Not Found';
  public static readonly notFoundMessageDetail = 'The target resource cannot be found';

  public static getHttpResponseMessages(data: HttpResponseBase | any): string[] {
    const responses: string[] = [];

    if (data instanceof HttpResponseBase) {
      if (this.checkNoNetwork(data)) {
        responses.push(`${this.noNetworkMessageCaption}${this.captionAndMessageSeparator} ${this.noNetworkMessageDetail}`);
      } else {
        const responseObject = this.getResponseBody(data);

        if (responseObject && (typeof responseObject === 'object' || responseObject instanceof Object)) {

          for (const key in responseObject) {
            if (key) {
              responses.push(`${key}${this.captionAndMessageSeparator} ${responseObject[key]}`);
            } else if (responseObject[key]) {
              responses.push(responseObject[key].toString());
            }
          }
        }
      }

      if (!responses.length) {
        if ((data as any).body) {
          responses.push(`body: ${(data as any).body}`);
        }

        if ((data as any).error) {
          responses.push(`error: ${(data as any).error}`);
        }
      }
    }

    if (!responses.length) {
      if (this.getResponseBody(data)) {
        responses.push(this.getResponseBody(data).toString());
      } else {
        responses.push(data.toString());
      }
    }

    if (this.checkAccessDenied(data)) {
      responses.splice(0, 0, `${this.accessDeniedMessageCaption}${this.captionAndMessageSeparator} ${this.accessDeniedMessageDetail}`);
    }

    if (this.checkNotFound(data)) {
      let message = `${this.notFoundMessageCaption}${this.captionAndMessageSeparator} ${this.notFoundMessageDetail}`;
      if (data.url) {
        message += `. ${data.url}`;
      }

      responses.splice(0, 0, message);
    }

    return responses;
  }

  public static getHttpResponseMessage(data: HttpResponseBase | any): string {
    const httpMessage =
      Utilities.findHttpResponseMessage(Utilities.noNetworkMessageCaption, data) ||
      Utilities.findHttpResponseMessage(Utilities.notFoundMessageCaption, data) ||
      Utilities.findHttpResponseMessage('error_description', data) ||
      Utilities.findHttpResponseMessage('error', data) ||
      Utilities.getHttpResponseMessages(data).join();

    return httpMessage;
  }

  public static findHttpResponseMessage(
    messageToFind: string,
    data: HttpResponse<any> | any,
    searchInCaptionOnly = true,
    includeCaptionInResult = false): string {
    const searchString = messageToFind.toLowerCase();
    const httpMessages = this.getHttpResponseMessages(data);

    for (const message of httpMessages) {
      const fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);

      if (fullMessage.firstPart && fullMessage.firstPart.toLowerCase().indexOf(searchString) != -1) {
        return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
      }
    }

    if (!searchInCaptionOnly) {
      for (const message of httpMessages) {

        if (message.toLowerCase().indexOf(searchString) != -1) {
          if (includeCaptionInResult) {
            return message;
          } else {
            const fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);
            return fullMessage.secondPart || fullMessage.firstPart;
          }
        }
      }
    }

    return null;
  }

  public static getResponseBody(response: HttpResponseBase) {
    if (response instanceof HttpResponse) {
      return response.body;
    }

    if (response instanceof HttpErrorResponse) {
      return response.error || response.message || response.statusText;
    }
  }

  public static checkNoNetwork(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status == 0;
    }

    return false;
  }

  public static checkAccessDenied(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status == 403;
    }

    return false;
  }

  public static checkNotFound(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status == 404;
    }

    return false;
  }

  public static checkIsLocalHost(url: string, base?: string) {
    if (url) {
      const location = new URL(url, base);
      return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    }

    return false;
  }

  public static getQueryParamsFromString(paramString: string) {

    if (!paramString) {
      return null;
    }

    const params: { [key: string]: string } = {};

    for (const param of paramString.split('&')) {
      const keyValue = Utilities.splitInTwo(param, '=');
      params[keyValue.firstPart] = keyValue.secondPart;
    }

    return params;
  }

  public static splitInTwo(text: string, separator: string): { firstPart: string, secondPart: string } {
    const separatorIndex = text.indexOf(separator);

    if (separatorIndex == -1) {
      return { firstPart: text, secondPart: null };
    }

    const part1 = text.substr(0, separatorIndex).trim();
    const part2 = text.substr(separatorIndex + 1).trim();

    return { firstPart: part1, secondPart: part2 };
  }

  public static safeStringify(object: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }) {

    let result: string;

    try {
      result = JSON.stringify(object);
      return result;
    } catch (error) {
      //
    }

    const simpleObject: Record<string, unknown> = {};

    for (const prop in object) {
      if (!object.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof (object[prop]) == 'object') {
        continue;
      }
      if (typeof (object[prop]) == 'function') {
        continue;
      }
      simpleObject[prop] = object[prop];
    }

    result = '[***Sanitized Object***]: ' + JSON.stringify(simpleObject);

    return result;
  }

  public static JsonTryParse(value: string) {
    try {
      return JSON.parse(value);
    } catch (e) {
      if (value === 'undefined') {
        return void 0;
      }
      return value;
    }
  }

  public static baseUrl() {
    let base = '';

    if (window.location.origin) {
      base = window.location.origin;
    } else {
      base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    return base.replace(/\/$/, '');
  }

  public static searchArray(searchTerm: string, caseSensitive: boolean, ...values: any[]) {
    if (!searchTerm) {
      return true;
    }

    let filter = searchTerm.trim();
    let data = values.join();

    if (!caseSensitive) {
      filter = filter.toLowerCase();
      data = data.toLowerCase();
    }

    return data.indexOf(filter) != -1;
  }

  public static moveArrayItem(array: any[], oldIndex: number, newIndex: number) {

    if (oldIndex < 0) {
      return;
    }

    if (newIndex < 0) {
      newIndex += array.length;
    }

    if (newIndex >= array.length) {
      let k = newIndex - array.length;
      while ((k--) + 1) {
        array.push(undefined);
      }
    }

    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  }

  public static expandCamelCase(text: string) {

    if (!text) {
      return text;
    }

    return text.replace(/([A-Z][a-z]+)/g, ' $1')
      .replace(/([A-Z][A-Z]+)/g, ' $1')
      .replace(/([^A-Za-z ]+)/g, ' $1');
  }

  public static testIsAbsoluteUrl(url: string) {
    const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    return r.test(url);
  }

  public static convertToAbsoluteUrl(url: string) {
    return Utilities.testIsAbsoluteUrl(url) ? url : '//' + url;
  }
}
