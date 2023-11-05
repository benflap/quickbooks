/*
  Copyright 2019-2021 Apigrate LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import fetch from 'node-fetch';
import * as queryString from 'query-string';

import dubug from 'debug';

const debug = dubug('gr8:quickbooks');
const verbose = dubug('gr8:quickbooks:verbose');

import { EventEmitter } from 'node:events';

const DISCOVERY_URL_PRODUCTION =
  'https://developer.api.intuit.com/.well-known/openid_configuration';
const DISCOVERY_URL_SANDBOX =
  'https://developer.api.intuit.com/.well-known/openid_sandbox_configuration';

const USER_AGENT = 'Apigrate QuickBooks NodeJS Connector/4.x';

export const PRODUCTION_API_BASE_URL = 'https://quickbooks.api.intuit.com';
export const SANDBOX_API_BASE_URL = 'https://sandbox-quickbooks.api.intuit.com';

import { type RequestInit } from 'node-fetch';

export type Credentials = {
  access_token: string;
  refresh_token: string;
  realm_id: string;
};

type ConnectorConstuctorOptions = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  is_sandbox?: boolean;
  base_url?: string;
  minor_version?: number;
  credential_initializer?: () => Promise<Credentials> | Credentials;
} & Partial<Credentials>;

import { registry } from './registry';

interface FetchOptions extends RequestInit {
  headers: {
    Accept: string;
    'Content-Type': string;
    'User-Agent': string;
    Authorization?: string;
  };
}

type FunctionOptions = {
  minor_version?: number;
  reqid?: string;
};
type QueryString = {
  minorversion?: number;
  requestid?: string;
  operation?: 'update' | 'delete';
  query?: string;
};

type Create = (payload: any, options?: FunctionOptions) => Promise<any>;
type Createable<TEntity> = TEntity extends { create: true } ? Create : never;

type Update = (payload: any, options?: FunctionOptions) => Promise<any>;
type Updateable<TEntity> = TEntity extends { update: true } ? Update : never;

type Read = (id: number, options?: FunctionOptions) => Promise<any>;
type Readable<TEntity> = TEntity extends { read: true } ? Read : never;

type Delete = (payload: any, options?: FunctionOptions) => Promise<any>;
type Deleteable<TEntity> = TEntity extends { delete: true } ? Delete : never;

type AccountingQuery = (
  queryStatement?: string | null,
  options?: FunctionOptions
) => Promise<any>;
type Queryable<TEntity> = TEntity extends { query: true }
  ? AccountingQuery
  : never;

type QueryableReport<TEntity> = TEntity extends { report: true }
  ? ReportQuery
  : never;
type ReportQuery = (
  params: { [key: string]: string },
  options?: FunctionOptions
) => Promise<any>;

type Batch = (payload: any) => Promise<any>;

type ApiEntities = {
  [K in RegistryEntry['handle']]: {
    name: K;
    fragment: Extract<RegistryEntry, { handle: K }>['fragment'];
    create: Createable<Extract<RegistryEntry, { handle: K }>>;
    get: Readable<Extract<RegistryEntry, { handle: K }>>;
    update: Updateable<Extract<RegistryEntry, { handle: K }>>;
    delete: Deleteable<Extract<RegistryEntry, { handle: K }>>;
    query: Queryable<Extract<RegistryEntry, { handle: K }>>;
  };
};

type QboAccounting = ApiEntities & {
  batch: Batch;
};

type RegistryEntry = (typeof registry)[number];

interface BaseEntry {
  readonly handle: string;
  readonly name: string;
  readonly fragment: string;
}

interface CRUDOperations {
  readonly create?: boolean;
  readonly read?: boolean;
  readonly update?: boolean;
  readonly delete?: boolean;
  readonly query?: boolean;
  readonly report?: boolean;
}

type Entry = BaseEntry & CRUDOperations;

export interface QboConnector extends ConnectorConstuctorOptions {
  endpoints: {
    authorization_endpoint: string;
    token_endpoint: string;
    revocation_endpoint: string;
  } | null;
  registry: typeof registry;
  accounting: {
    intuit_tid: string | null;
  };
  accounting_api: QboAccounting | null;
}

/**
 * NodeJS QuickBooks connector class for the Intuit v3 Accounting API.
 *
 * @version 4.2.x
 */
export class QboConnector extends EventEmitter {
  /**
   * @param {object} config
   * @param {string} config.client_id (required) the Intuit-generated client id for your app
   * @param {string} config.client_secret (required) the Intuit-generate client secret for your app
   * @param {string} config.redirect_uri (required) a valid OAuth2 redirect URI for your app
   * @param {string} config.access_token access token obtained via the OAuth2 process
   * @param {string} config.refresh_token  refresh token obtained via the Oauth2 process, used to obtain access tokens automatically when they expire
   * @param {string} config.realm_id company identifer for the QuickBooks instance
   * @param {boolean} config.is_sandbox boolean indicating whether this is a sandbox connection (default: false)
   * @param {string} config.base_url defaults to either 'https://quickbooks.api.intuit.com' or 'https://sandbox-quickbooks.api.intuit.com'
   * (depending on sandbox setting) if not provided.
   * @param {number} config.minor_version optional minor version to use on API calls to the QuickBooks API. This will become the default minor version applied to all
   * API calls. You can override the minor_version on specific calls, by providing it as an options argument on the API call.
   * See https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/minor-versions to learn more about minor versions.
   * @param {function} config.credential_initializer optional (but recommended) function returning an object with the initial credentials to be used, of the form
   * `{ access_token, refresh_token, realm_id}`. This function is invoked on the first API method invocation automatically. If you omit this function, you'll need
   * to call the setCredentials method prior to your first API method invocation.
   */
  constructor(config: ConnectorConstuctorOptions) {
    super();

    if (!config.client_id || !config.client_secret || !config.redirect_uri) {
      throw new CredentialsError(
        `Invalid configuration. The "client_id", "client_secret", and "redirect_uri" properties are all required.`
      );
    }
    this.client_id = config.client_id;
    this.client_secret = config.client_secret;
    this.redirect_uri = config.redirect_uri;

    this.access_token = config.access_token || null;
    this.refresh_token = config.refresh_token || null;
    this.realm_id = config.realm_id || null;

    this.minor_version = config.minor_version || null;
    this.credential_initializer = config.credential_initializer || null;
    this.is_sandbox = config.is_sandbox || false;
    this.base_url = this.is_sandbox
      ? SANDBOX_API_BASE_URL
      : PRODUCTION_API_BASE_URL; // from discovery.
    if (config.base_url) {
      this.base_url = config.base_url;
    }

    this.endpoints = null; /*{
      authorization_endpoint: null,
      token_endpoint: null,
      revocation_endpoint: null,
    };*/

    this.registry = registry;

    this.accounting = {
      intuit_tid: null, //tid from most recent api call
    };

    this.accounting_api = null;
  } //end constructor

  /**
   * Sets the credentials on the connector. If any of the creds properties are missing,
   * the corresponding internal property will NOT be set.
   * @param {object} creds
   * @param {string} creds.access_token the Intuit access token
   * @param {string} creds.realm_id the Intuit realm (company id)
   * @param {string} creds.refresh_token the Intuit refresh token
   */
  setCredentials(creds: Partial<Credentials>) {
    if (!creds) throw new CredentialsError('No credentials provided.');
    if (creds.access_token) {
      if (this.access_token && this.access_token !== creds.access_token) {
        //Informational. Intuit sent a replacement access token that is different than the one currently stored.
        debug(
          `A replacement access_token was detected:\n${creds.access_token}`
        );
      }
      this.access_token = creds.access_token;
    }
    if (creds.refresh_token) {
      if (this.refresh_token && this.refresh_token !== creds.refresh_token) {
        //Informational. Intuit sent a replacement refresh token that is different than the one currently stored.
        debug(
          `A replacement refresh_token was detected:\n${creds.refresh_token}`
        );
      }
      this.refresh_token = creds.refresh_token;
    }
    if (creds.realm_id) {
      if (this.realm_id && this.realm_id !== creds.realm_id) {
        //Informational. Intuit sent a replacement realm that is different than the one currently stored.
        debug(`A replacement realm_id was detected:\n${creds.realm_id}`);
      }
      this.realm_id = creds.realm_id;
    }
    // verbose(`${this.access_token}\n${this.refresh_token}\n${this.realm_id}`)
  }

  async loadDiscoveryInfo() {
    if (!this.endpoints) {
      let response = null;
      try {
        let doc_url = this.is_sandbox
          ? DISCOVERY_URL_SANDBOX
          : DISCOVERY_URL_PRODUCTION;
        debug(`Loading discovery document from ${doc_url}`);
        response = await fetch(doc_url);
        let { authorization_endpoint, token_endpoint, revocation_endpoint } =
          await response.json();
        this.endpoints = {
          authorization_endpoint,
          token_endpoint,
          revocation_endpoint,
        };
      } catch (err) {
        throw new ApiError(
          `Intuit Discovery Document Error: ${err.messsage}`,
          null,
          response.headers.get('intuit_tid')
        );
      }
    }
  }

  /**
   * Get the object through which you can interact with the QuickBooks Online Accounting API.
   */
  accountingApi() {
    const self = this;
    const api: Partial<ApiEntities> = {};

    this.registry.forEach(function (entry: Entry) {
      api[entry.handle] = {
        name: entry.name,
        fragment: entry.fragment,
        ...(isCreatable(entry) ? makeCreate(entry) : {}),
        ...(isUpdateable(entry) ? makeUpdate(entry) : {}),
        ...(isReadable(entry) ? makeRead(entry) : {}),
        ...(isDeletable(entry) ? makeDelete(entry) : {}),
        ...(isQueryable(entry) ? makeAccountingQuery(entry) : {}),
        ...(isReportable(entry) ? makeReportQuery(entry) : {}),
      };
    });

    function isCreatable(entry: Entry): entry is Entry & { create: true } {
      return entry.create === true;
    }
    function isUpdateable(entry: Entry): entry is Entry & { update: true } {
      return entry.update === true;
    }
    function isReadable(entry: Entry): entry is Entry & { read: true } {
      return entry.read === true;
    }
    function isDeletable(entry: Entry): entry is Entry & { delete: true } {
      return entry['delete'] === true;
    }
    function isQueryable(entry: Entry): entry is Entry & { query: true } {
      return entry.query === true;
    }
    function isReportable(entry: Entry): entry is Entry & { report: true } {
      return entry.report === true;
    }

    function makeCreate(entry: Entry & { create: true }): { create: Create } {
      return {
        create: function (payload, opts) {
          var qs: QueryString = {};
          if (opts && opts.reqid) {
            qs.requestid = opts.reqid;
          }
          if (opts && opts.minor_version) {
            qs.minorversion = opts.minor_version;
          } else if (self.minor_version) {
            qs.minorversion = self.minor_version;
          }
          return self._post.call(
            self,
            entry.name,
            `/${entry.fragment}`,
            qs,
            payload
          );
        },
      };
    }
    function makeUpdate(entry: Entry & { update: true }): { update: Update } {
      return {
        update: function (payload, opts) {
          var qs: QueryString = { operation: 'update' };
          if (opts && opts.reqid) {
            qs.requestid = opts.reqid;
          }
          if (opts && opts.minor_version) {
            qs.minorversion = opts.minor_version;
          } else if (self.minor_version) {
            qs.minorversion = self.minor_version;
          }
          return self._post.call(
            self,
            entry.name,
            `/${entry.fragment}`,
            qs,
            payload
          );
        },
      };
    }

    function makeRead(entry: Entry & { read: true }): { get: Read } {
      return {
        get: function (id, opts) {
          var qs: QueryString = null;
          if (opts && opts.reqid) {
            if (!qs) qs = {};
            qs.requestid = opts.reqid;
          }
          if (opts && opts.minor_version) {
            if (!qs) qs = {};
            qs.minorversion = opts.minor_version;
          } else if (self.minor_version) {
            if (!qs) qs = {};
            qs.minorversion = self.minor_version;
          }
          return self._get.call(
            self,
            entry.name,
            `/${entry.fragment}/${id}`,
            qs
          );
        },
      };
    }

    function makeDelete(entry: Entry & { delete: true }): { delete: Delete } {
      return {
        delete: function (payload, opts) {
          var qs: QueryString = { operation: 'delete' };
          if (opts && opts.reqid) {
            qs.requestid = opts.reqid;
          }
          if (opts && opts.minor_version) {
            qs.minorversion = opts.minor_version;
          } else if (self.minor_version) {
            qs.minorversion = self.minor_version;
          }
          return self._post.call(
            self,
            entry.name,
            `/${entry.fragment}`,
            qs,
            payload
          );
        },
      };
    }

    function makeAccountingQuery(entry: Entry & { query: true }): {
      query: AccountingQuery;
    } {
      return {
        query: function (queryStatement, opts) {
          if (!queryStatement) {
            queryStatement = `select * from ${entry.name}`;
          }
          var qs: QueryString = {
            query: queryStatement,
          };
          if (opts && opts.reqid) {
            qs.requestid = opts.reqid;
          }
          if (opts && opts.minor_version) {
            qs.minorversion = opts.minor_version;
          } else if (self.minor_version) {
            if (!qs) qs = {};
            qs.minorversion = self.minor_version;
          }

          return self._get.call(self, entry.name, `/query`, qs);
        },
      };
    }

    function makeReportQuery(entry: Entry & { report: true }): {
      query: ReportQuery;
    } {
      return {
        query: function (parms, opts) {
          var qs = parms || {};
          if (opts && opts.reqid) {
            qs.requestid = opts.reqid;
          }
          if (opts && opts.minor_version) {
            qs.minorversion = opts.minor_version.toString();
          } else if (self.minor_version) {
            if (!qs) qs = {};
            qs.minorversion = self.minor_version.toString();
          }

          return self._get.call(
            self,
            entry.name,
            `/reports/${entry.fragment}`,
            qs
          );
        },
      };
    }

    const batch = function (payload) {
      const self = this;
      return self._batch.call(self, payload);
    };

    return Object.assign(api, { batch }) as QboAccounting;
  }

  /**
    Sends any GET request for API calls. Includes token refresh retry capabilities.
    @param {string} entityName the name of the entity in the registry.
    @param {string} uri (after base url).
    @param {object} qs query string hash
  */
  async _get(entityName, uri, qs) {
    return this.doFetch('GET', `${uri}`, qs, null, { entityName });
  }

  async _post(entityName, uri, qs, body) {
    return this.doFetch('POST', `${uri}`, qs, body, { entityName });
  }

  async _batch(body) {
    return this.doFetch('POST', `/batch`, null, body);
  }

  /**
   * Internal method to make an API call using node-fetch.
   *
   * @param {string} method GET|POST|PUT|DELETE
   * @param {string} url api endpoint url (without query parameters)
   * @param {object} query hash of query string parameters to be added to the url
   * @param {object} payload for POST, PUT methods, the data payload to be sent
   * @param {object} options hash of additional options
   * @param {object} options.headers hash of headers. Specifying the headers option completely
   * replaces the default headers.
   */
  async doFetch(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    query: { [key: string]: string },
    payload: any,
    options: {
      headers?: FetchOptions['headers'];
      entityName?: string;
      retries?: number;
    } = {}
  ) {
    if (!this.refresh_token || !this.access_token || !this.realm_id) {
      if (!this.refresh_token) verbose(`Missing refresh_token.`);
      if (!this.access_token) verbose(`Missing access_token.`);
      if (!this.realm_id) verbose(`Missing realm_id.`);
      if (this.credential_initializer) {
        verbose(`Obtaining credentials from initializer...`);
        let creds = await this.credential_initializer();
        if (creds) {
          this.setCredentials(creds);
        }
        if (!this.refresh_token || !this.access_token || !this.realm_id) {
          throw new CredentialsError('Missing credentials after initializer.');
        }
      } else {
        throw new CredentialsError(
          'Missing credentials. Please provide them explicitly, or use an initializer function.'
        );
      }
    }
    if (!options.retries) {
      options.retries = 0;
    }

    let fetchOpts: FetchOptions = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
    };

    if (this.access_token) {
      fetchOpts.headers.Authorization = `Bearer ${this.access_token}`;
    }

    if (options && options.headers) {
      fetchOpts.headers = options.headers;
    }

    let qstring = '';
    if (query) {
      qstring = queryString.stringify(query);
      qstring = '?' + qstring;
    }
    let full_url = `${this.base_url}/v3/company/${this.realm_id}${url}${qstring}`;

    if (payload) {
      if (
        fetchOpts.headers['Content-Type'] ===
        'application/x-www-form-urlencoded'
      ) {
        fetchOpts.body = payload;
        verbose(`  raw payload: ${payload}`);
      } else {
        //assume json
        fetchOpts.body = JSON.stringify(payload);
        verbose(`  JSON payload: ${JSON.stringify(payload)}`);
      }
    }

    try {
      debug(
        `${method}${
          options.entityName ? ' ' + options.entityName : ''
        } ${full_url}`
      );

      let response = await fetch(full_url, fetchOpts);
      let result = null;
      this.accounting.intuit_tid = response.headers.get('intuit_tid'); //record last tid.
      verbose(`  Intuit TID: `, response.headers.get('intuit_tid'));
      if (response.ok) {
        debug(`  ...OK HTTP-${response.status}`);
        result = await response.json();
        verbose(`  response payload: ${JSON.stringify(result)}`);
      } else {
        debug(`  ...Error. HTTP-${response.status}`);

        //Note: Some APIs return HTML or text depending on status code...

        if (response.status >= 300 && response.status < 400) {
          //redirection
        } else if (response.status >= 400 && response.status < 500) {
          if (response.status === 401) {
            //These will be retried once after attempting to refresh the access token.
            let textResult = await response.text();
            throw new ApiAuthError(textResult);
          } else if (response.status === 404) {
            throw new ApiError(
              'Resource not found. Recommendation: check resource is supported or base URL configuration.',
              `${method} ${full_url}`,
              response.headers.get('intuit_tid')
            );
          } else if (response.status === 429) {
            //API Throttling Error
            let textResult = await response.text();
            throw new ApiThrottlingError(
              'API request limit reached.',
              textResult,
              response.headers.get('intuit_tid')
            );
          }

          // otherclient errors
          let result = await response.json();
          let explain = '';
          if (result && result.Fault) {
            result.Fault.Error.forEach(function (x) {
              //This function just logs output (or returns the result if "not found")
              switch (x.code) {
                case '500':
                  explain += `\nError code ${x.code}. ${x.Detail}. Recommendation: possible misconfiguration the entity name is not recognized.`;
                  break;
                case '2010':
                  explain += `\nError code ${x.code}. ${x.Detail}. Recommendation: possible misconfiguration the entity name is not recognized.`;
                  break;
                case '4000':
                  explain += `\nError code ${x.code}. ${x.Detail}. Recommendation: check your query, including punctuation etc. For example, you might be using double quotes instead of single quotes.`;
                  break;
                case '4001':
                  explain += `\nError code ${x.code}. ${x.Detail}. Recommendation: check your entity and attribute names to make sure the match QuickBooks API specifications.`;
                  break;
                default:
                  explain += `\nError code ${x.code}. ${x.Detail}.`;
              }
            });
          }
          if (!explain) explain = JSON.stringify(result);
          throw new ApiError(
            `Client Error (HTTP ${response.status}) ${explain}`,
            result,
            response.headers.get('intuit_tid')
          );
        } else if (response.status >= 500) {
          //server side errors
          verbose(
            `  server error. response payload: ${JSON.stringify(result)}`
          );
          throw new ApiError(
            `Server Error (HTTP ${response.status})`,
            result,
            response.headers.get('intuit_tid')
          );
        }
        return result;
      }
      return result;
    } catch (err) {
      if (err instanceof ApiAuthError) {
        if (options.retries < 1) {
          debug(`Attempting to refresh access token...`);
          //Refresh the access token.
          await this.getAccessToken();

          options.retries += 1;
          debug(`...refreshed OK.`);
          //Retry the request
          debug(`Retrying (${options.retries}) request...`);
          let retryResult = await this.doFetch(
            method,
            url,
            query,
            payload,
            options
          );
          return retryResult;
        } else {
          debug(`No further retry (already retried ${options.retries} times).`);
          throw err;
        }
      }
      //All other errors are re-thrown.
      throw err;
    }
  }

  /**
   * Calls the Intuit OAuth2 token endpoint for either an authorization_code grant (if the code is provided) or a
   * refresh_token grant. In either case the internal credentials are refreshed, and the "token.refreshed" event is
   * omitted with the credentials returned so they can be stored securely for subsequent use.
   *
   * @param {string} code (optional) authorization code obtained from the user consent part of the OAuth2 flow.
   * If provided, the method assumes an authorization_code grant type is being requested; otherwise the refresh_token
   * grant type is assumed.
   * @param {string} realm_id (conditional) required when the code is provided. Identifies the quickbooks company. Internally sets the realm_id on the connector.
   * @returns the access token data payload
   * @throws CredentialsError on invalid grants.
   * @emits `token.refreshed` with the data payload
   * @example
   *  {
   *    token_type: "Bearer"
   *    realm_id: string,
   *    access_token: string,
   *    expires_in: number, //(number of seconds access token lives),
   *    refresh_token: string,
   *    x_refresh_token_expires_in: number //(number of seconds refresh token lives)
   *  }
   */
  async getAccessToken(code?, realm_id?) {
    await this.loadDiscoveryInfo();

    let fetchOpts: FetchOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
        Authorization: `Basic ${Buffer.from(
          this.client_id + ':' + this.client_secret
        ).toString('base64')}`,
      },
    };
    verbose(`Headers: ${JSON.stringify(fetchOpts.headers, null, 2)}`);
    let grant_type = 'refresh_token';
    if (code) {
      grant_type = 'authorization_code';
      debug(`Exchanging authorization code for an Intuit access token...`);
      fetchOpts.body = `code=${encodeURIComponent(
        code
      )}&grant_type=${grant_type}&redirect_uri=${encodeURIComponent(
        this.redirect_uri
      )}`;
    } else {
      debug('Refreshing Intuit access token...');
      fetchOpts.body = `grant_type=${grant_type}&refresh_token=${encodeURIComponent(
        this.refresh_token
      )}`;
    }

    verbose(`Sending: ${fetchOpts.body}`);
    let response = await fetch(this.endpoints.token_endpoint, fetchOpts);
    if (!response.ok) {
      debug('...unsuccessful.');
      let result = await response.json();
      throw new CredentialsError(
        `Unsuccessful ${grant_type} grant. (HTTP-${
          response.status
        }): ${JSON.stringify(result)}`
      );
    }

    let result = await response.json();
    verbose(`Received:\n${JSON.stringify(result)}`);

    let credentials: Partial<Credentials> = {};
    Object.assign(credentials, result);

    if (realm_id) {
      // if realm_id is explicitly provided, initialize with existing realm id - usually realm id is not available on a refresh
      credentials.realm_id = realm_id;
    } else if (this.realm_id) {
      // otherwise use internal realm id if available
      credentials.realm_id = this.realm_id;
    }

    if (result.realmId) {
      //Note spelling! Intuit calls it realmId not realm_id.
      //If realmId is ever returned explicitly, use it.
      credentials.realm_id = result.realmId;
    }

    // Reset the internal credentials (this detects changes)
    this.setCredentials(credentials);

    //After the internal credentials are refreshed, emit the event.
    this.emit('token.refreshed', credentials as Credentials);

    return credentials;
  }

  /**
   * Disconnects the user from Intuit QBO API (invalidates the access token and request token).
   * After calling this method, the user will be forced to authenticate again.
   * Emits the "token.revoked" event, handing back the data passed back from QBO.
   */
  async disconnect() {
    try {
      await this.loadDiscoveryInfo();
      debug(`Disconnecting from the Intuit API.`);
      if (this.credential_initializer) {
        //Get latest credentials before disconnecting.
        let creds = await this.credential_initializer();
        verbose(
          `Obtained credentials from initializer:${JSON.stringify(creds)}.`
        );
        if (creds) {
          this.setCredentials(creds);
        }
      }
      if (this.refresh_token) {
        let payload = { token: this.refresh_token };
        verbose(`Disconnection payload:\n${JSON.stringify(payload)}`);
        let fetchOpts = {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              this.client_id + ':' + this.client_secret
            ).toString('base64')}`,
            'Content-Type': 'application/json',
            'User-Agent': USER_AGENT,
          },
          body: JSON.stringify(payload),
        };

        let response = await fetch(
          this.endpoints.revocation_endpoint,
          fetchOpts
        );
        let result = await response.text();
        if (response.ok) {
          this.emit('token.revoked', result);
        } else {
          console.warn(
            `Intuit responded with HTTP-${response.status} ${result}`
          );
        }
        return result;
      } else {
        debug('No token found to revoke.');
      }
    } catch (err) {
      console.error(err);
      console.error(
        `Error during Intuit API disconnection process. ${JSON.stringify(
          err,
          null,
          2
        )}`
      );
      throw err;
    }
  }

  /**
    Returns a fully populated validation URL to be used for initiating an Intuit OAuth request.
    
    @param {string} state Provides any state that might be useful to your application upon receipt
      of the response. The Intuit Authorization Server roundtrips this parameter, so your application
      receives the same value it sent. Including a CSRF token in the state is recommended.

    @return the authorization URL string with all parameters set and encoded.
    Note, when the redirectUri is invoked, it will contain the following query parameters:
    1. `code` (what you exchange for a token)
    2. `realmId` - this identifies the QBO company and should be used (note spelling)
  */
  async getIntuitAuthorizationUrl(state) {
    await this.loadDiscoveryInfo();
    var url =
      `${this.endpoints.authorization_endpoint}` +
      `?client_id=${encodeURIComponent(this.client_id)}` +
      `&scope=${encodeURIComponent('com.intuit.quickbooks.accounting')}` +
      `&redirect_uri=${encodeURIComponent(this.redirect_uri)}` +
      `&response_type=code` +
      `&state=${encodeURIComponent(state)}`;

    return url;
  }
} //QboConnector

interface ApiError extends Error {
  payload: any;
  intuit_tid: string;
}

/** An API error from the connector, typically including a captured `payload` object you can work with to obtain more information about the error and how to handle it. */
class ApiError extends Error {
  constructor(msg, payload, intuit_tid) {
    super(msg);
    this.payload = payload; //Stores the Intuit response.
    this.intuit_tid = intuit_tid;
  }
}

/** Specific type of API error indicating the API request limit has been reached. */
class ApiThrottlingError extends ApiError {
  constructor(msg, payload, intuit_tid) {
    super(msg, payload, intuit_tid);
  }
}
class ApiAuthError extends Error {} //only used internally.
class CredentialsError extends Error {} //For missing/incomplete/invalid OAuth credentials.

export { ApiError, ApiThrottlingError, ApiAuthError, CredentialsError };
