import {
  ContentTypeHTML,
  ContentTypeJSON,
  ContentTypeXML,
  HeaderContentType,
  HeaderLocation
} from './constant';
import { TSMap } from 'typescript-map';
import { Buffer } from 'buffer';

const base64Encode = (str: string): string =>
  Buffer.from(str, 'binary').toString('base64');

// This is a convenient function to initialize a response with JSON content type
// Example: new Stub().willReturn(JSONResponse({fieldData: "field_value"}))
export function JSONResponse(obj: object) {
  const r = new StubResponse();
  return r.withBody(ContentTypeJSON, obj);
}

// This is a convenient function to initialize a response with HTML content type
// Example: new Stub().willReturn(HTMLResponse('<html></html>'))
export function HTMLResponse(content: string) {
  const r = new StubResponse();
  return r.withBody(ContentTypeHTML, base64Encode(content));
}

// This is a convenient function to initialize a response with XML content type
// Example: new Stub().willReturn(HTMLResponse('<xml></xml>'))
export function XMLResponse(content: string) {
  const r = new StubResponse();
  return r.withBody(ContentTypeXML, base64Encode(content));
}

export class StubResponse {
  // Required. Define the response status code
  // GRPC. Default 0 OK: https://grpc.github.io/grpc/core/md_doc_statuscodes.html
  // HTTP. Default 200 OK: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
  statusCode: number;

  // Holds expected response body
  // Format must be either raw JSON object or base64 encoded string for HTML, XML, binary...
  body: string | object | Map<string, any>;

  // This is the id of uploaded file that can be used to simulate the download
  // Or can be used to respond a large data payload which is not suitable to save in database
  bodyFile: string;

  // Optional. Define response cookies
  // This is not applied for GRPC
  cookies: Cookie[];

  // Optional. Define response http headers
  // This is equivalent to response metadata in GRPC
  header: TSMap<string, string>;

  // Error is optional. Defines response error for grpc
  // This is not applied for HTTP since body and status code can be used
  error: ResponseError;

  // Optional. If defined, then executed template will override response data
  template: Template;

  // Set response status code
  // GRPC. Default 0 OK: https://grpc.github.io/grpc/core/md_doc_statuscodes.html
  // HTTP. Default 200 OK: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
  withStatusCode(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

  // Sets response header for HTTP
  // Will be user as response metadata for GRPC
  withHeader(name: string, value: string) {
    if (!this.header) {
      this.header = new TSMap<string, string>();
    }

    this.header.set(name, value);
    return this;
  }

  // Simulate redirection behavior. Rio will redirect request to the given URL
  // Use WithStatusCode if want to customize the redirect code
  withRedirect(url: string) {
    this.statusCode = 307;
    return this.withHeader(HeaderLocation, url);
  }

  // Adds cookies for HTTP
  withCookie(name: string, value: string, expiredAt: Date) {
    if (!this.cookies) {
      this.cookies = [];
    }

    this.cookies.push(new Cookie(name, value, expiredAt));
    return this;
  }

  // Sets body
  withBody(contentType: string, body: any) {
    this.body = body;
    return this.withHeader(HeaderContentType, contentType);
  }

  // Sets file id for response body
  // This should be used for large data response such as images, pdf, ... which are too large to store at database
  // This can also be used to simulate the download request
  // Handler will download file by this id and assign to body
  withFileBody(contentType: string, fileID: string) {
    this.bodyFile = fileID;
    return this.withHeader(HeaderContentType, contentType);
  }

  // withGRPCError sets error for gRPC
  withGRPCError(msg: string, detail: ErrorDetail) {
    if (!this.error) {
      this.error = new ResponseError();
      this.error.details = [];
    }

    this.error.message = msg;
    this.error.details.push(detail);
    return this;
  }
}

// Cookie defines cookie
export class Cookie {
  name: string;
  value: string;
  expiredAt: string;

  constructor(name: string, value: string, expiredAt: Date) {
    this.name = name;
    this.value = value;
    this.expiredAt = expiredAt.toISOString();
  }
}

// ResponseError defines GRPC response error
// Follow the same structure with https://pkg.go.dev/google.golang.org/grpc/internal/status
// - response.statusCode -> status.Code
// - response.error.message -> status.Message
// - response.error.details -> status.Details
export class ResponseError {
  message: string;
  details: ErrorDetail[];
}

// Define detail structure for gRPC error
export class ErrorDetail {
  // Full proto name of error type including namespace and type. For example: order.v1.CommonError
  // This is to get message descriptor to encode/decode message
  // The proto of defined type must be included in proto compressed file
  type: string;

  // Value holds a custom payload of the error
  value: TSMap<string, any>;
}

export class Template {
  // Supported json and yaml. Default value is yaml
  scriptSchemaType: string;

  // Script is content of template file
  // See ResponseScript for the detail structure
  script: string;
}
