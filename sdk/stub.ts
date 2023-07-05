import { Server } from './server';
import { camelCaseToSnakeCase } from './util';
import { RequestMatching, Rule, BodyRule, JSONPathRule } from './matching-rule';
import { StubResponse } from './response';

export class Stub {
  id: number;

  // Optional. Describes the stub
  description: string;

  // Optional. If a 3rd party API is being used by many internal services
  // A set of stubs for each service can be isolated by namespace
  // If this field is set to a non empty string, URL must be configured with the below format
  // http://<rio-domain>/<namespace>/echo
  namespace: string;

  // Optional. Custom tag for grouping stub
  // Owner can add whatever they want to classify the stub
  tag: string;

  // Defines protocol of incoming requests
  // Value is either: http or grpc. Default value is http
  protocol: string;

  // Matching rules which will be matched against the incoming requests
  request: RequestMatching;

  // The expected response which includes the body, header and cookies
  response: StubResponse;

  // The mock server will act as reserved proxy if this settings are provided
  proxy: StubProxy;

  active: boolean;

  // The higher weight, the higher priority
  // It is sometimes the case that you'll want to declare two or more stub mappings that "overlap",
  // in that a given request would be a match for more than one of them
  // By default, the most recently added matching stub will be used to satisfy the request
  // However, in some cases it is useful to exert more control
  weight: number;

  settings: StubSettings;

  createdAt: Date;

  updatedAt: Date;

  constructor() {
    this.request = new RequestMatching();
    this.active = true;
  }

  withNamespace(ns: string) {
    this.namespace = ns;
    return this;
  }

  withDescription(desc: string) {
    this.description = desc;
    return this;
  }

  withProtocol(v: string) {
    this.protocol = v;
    return this;
  }

  withTag(v: string) {
    this.tag = v;
    return this;
  }

  withWeight(v: number) {
    this.weight = v;
    return this;
  }

  // Sets to inactive
  withInactive() {
    this.active = false;
    return this;
  }

  // Deactivates when matched and used for an incoming request
  // This can be combined with withWeight to simulate different responses
  shouldDeactivateWhenMatched() {
    if (this.settings == undefined) {
      this.settings = new StubSettings();
    }

    this.settings.deactivateWhenMatched = true;
    return this;
  }

  // Sets delay duration in milliseconds
  // Use this to simulate the slow API response time
  shouldDelay(d: number) {
    if (this.settings == undefined) {
      this.settings = new StubSettings();
    }

    // Rio server uses nanosecond. 1ms = 1000000 nanoseconds
    this.settings.delayDuration = d * 1000000;
    return this;
  }

  // Sets the root url of the target API
  // Incoming equests will be forwarded to the given url with the same relative path
  withTargetURL(url: string) {
    if (this.proxy == undefined) {
      this.proxy = new StubProxy();
    }

    this.proxy.targetURL = url;
    return this;
  }

  // Enables recording request and response when proxies is enabled
  // The recorded data will be serialized to an inactive stub and saved to stubs table
  withEnableRecord(v: boolean) {
    if (this.proxy === undefined) {
      this.proxy = new StubProxy();
    }

    this.proxy.enableRecord = v;
    return this;
  }

  // Add a rule to match by request header
  withHeader(k: string, rule: Rule) {
    this.request.header.push({ fieldName: k, operator: rule });
    return this;
  }

  // Add a rule to match by request cookie
  withCookie(k: string, rule: Rule) {
    this.request.cookie.push({ fieldName: k, operator: rule });
    return this;
  }

  // Add a rule to match by request query parameter
  withQuery(k: string, rule: Rule) {
    this.request.query.push({ fieldName: k, operator: rule });
    return this;
  }

  // Add a rule to match by request body
  withRequestBody(rule: BodyRule) {
    this.request.body.push(rule);
    return this;
  }

  // This is a shortcut function to add matching rule with JSON path
  // It is equivalent to withRequestBody(JSONPathRule('<keyPath>', rule))
  withRequestBodyJSONPath(keyPath: string, rule: Rule) {
    this.request.body.push(JSONPathRule(keyPath, rule));
    return this;
  }

  // Sets the expected response
  willReturn(res: StubResponse) {
    this.response = res
    return this 
  }

  // Converts to a JSON string
  toJSON() {
    return JSON.stringify(camelCaseToSnakeCase(this));
  }

  // Submits stub to a remote server
  send(server: Server) {
    return server.createStub(camelCaseToSnakeCase(this));
  }
}

export class StubProxy {
  enableRecord: boolean;
  targetURL: string;
}

export class StubSettings {
  delayDuration: number;
  deactivateWhenMatched: boolean;
}
