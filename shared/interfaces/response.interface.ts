export interface IResponse<T> {
  isError: boolean;
  message: string;
  data: T;
}
