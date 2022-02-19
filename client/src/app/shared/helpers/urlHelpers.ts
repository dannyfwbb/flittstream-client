export class UrlHelpers {
  static isUrlPathEqual(path: string, link: string): boolean {
    const locationPath = UrlHelpers.getPathPartOfUrl(path);
    return link === locationPath;
  }

  static isUrlPathContain(path: string, link: string): boolean {
    const locationPath = UrlHelpers.getPathPartOfUrl(path);
    const endOfUrlSegmentRegExp = /\/|^$/;
    return locationPath.startsWith(link) &&
      locationPath.slice(link.length).charAt(0).search(endOfUrlSegmentRegExp) !== -1;
  }

  static getPathPartOfUrl(url: string): string {
    return url.match(/.*?(?=[?;#]|$)/)[0];
  }

  static getFragmentPartOfUrl(url: string): string {
    const matched = url.match(/#(.+)/);
    return matched ? matched[1] : '';
  }

  static isFragmentEqual(path: string, fragment: string): boolean {
    return UrlHelpers.getFragmentPartOfUrl(path) === fragment;
  }

  static isFragmentContain(path: string, fragment: string): boolean {
    return UrlHelpers.getFragmentPartOfUrl(path).includes(fragment);
  }
}
