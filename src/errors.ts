import { AxiosError, AxiosResponseHeaders } from "axios";
import * as http from "http";

export class HTTPRequestError extends Error {
  path?: string;
  method?: string;
  data?: unknown;
  status?: number;
  responseHeaders?: AxiosResponseHeaders;

  hasResponse = false;
  hasRequest = false;

  constructor(originalError: AxiosError) {
    super();
    this.message = originalError.message;
    if (originalError.response) {
      this.hasResponse = true;
      this.data = (originalError as AxiosError).response?.data;
      this.status = (originalError as AxiosError).response?.status;
      this.responseHeaders = (originalError as AxiosError).response?.headers;
    }
    if (originalError.request) {
      this.hasRequest = true;
      this.path = (originalError.request as http.ClientRequest).path;
      this.method = (originalError.request as http.ClientRequest).method;
    }
  }

  toJson(): {
    message: string;
    path?: string;
    method?: string;
    data?: unknown;
    status?: number;
    responseHeaders?: AxiosResponseHeaders;
    hasResponse: boolean;
    hasRequest: boolean;
  } {
    return {
      message: this.message,
      path: this.path,
      method: this.method,
      data: this.data,
      status: this.status,
      responseHeaders: this.responseHeaders,
      hasResponse: this.hasResponse,
      hasRequest: this.hasRequest,
    };
  }
}

export function handleAxiosError(err: AxiosError): never {
  throw new HTTPRequestError(err);
}
