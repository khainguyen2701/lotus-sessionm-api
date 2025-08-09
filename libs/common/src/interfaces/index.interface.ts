export type ResponseApi<T> = {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
  status: string;
};
