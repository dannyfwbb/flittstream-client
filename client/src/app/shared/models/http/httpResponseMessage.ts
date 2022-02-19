export interface HttpResponseMessage {
  type?: HttpResponseType;
  title?: string;
  titleArgs?: Record<string, unknown>;
  message?: string;
  messageArgs?: Record<string, unknown>;
}

export enum HttpResponseType {
  common = 0,
  error = 1,
  noNetwork = 2,
  accessDenied = 3,
  notFound = 4,
  notAuthenticated = 5,
}
