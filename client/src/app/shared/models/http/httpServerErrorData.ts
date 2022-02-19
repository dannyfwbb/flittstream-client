export interface HttpServerErrorData {
  title: string;
  status: number;
  detail?: string;
  traceId?: string;
}
