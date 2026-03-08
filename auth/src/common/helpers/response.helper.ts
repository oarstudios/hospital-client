export class ResponseHelper {
  static build<T>(
    statusCode: number,
    message: string,
    data: T | null = null,
  ) {
    return {
      statusCode,
      message,
      data,
    };
  }
}