/// <reference types="node" />
import { EventEmitter } from 'node:events';
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
type Create = (payload: any, options?: FunctionOptions) => Promise<any>;
type Createable<TEntity> = TEntity extends {
    create: true;
} ? Create : never;
type Update = (payload: any, options?: FunctionOptions) => Promise<any>;
type Updateable<TEntity> = TEntity extends {
    update: true;
} ? Update : never;
type Read = (id: number, options?: FunctionOptions) => Promise<any>;
type Readable<TEntity> = TEntity extends {
    read: true;
} ? Read : never;
type Delete = (payload: any, options?: FunctionOptions) => Promise<any>;
type Deleteable<TEntity> = TEntity extends {
    delete: true;
} ? Delete : never;
type AccountingQuery = (queryStatement?: string | null, options?: FunctionOptions) => Promise<any>;
type Queryable<TEntity> = TEntity extends {
    query: true;
} ? AccountingQuery : never;
type Batch = (payload: any) => Promise<any>;
type ApiEntities = {
    [K in RegistryEntry['handle']]: {
        name: K;
        fragment: Extract<RegistryEntry, {
            handle: K;
        }>['fragment'];
        create: Createable<Extract<RegistryEntry, {
            handle: K;
        }>>;
        get: Readable<Extract<RegistryEntry, {
            handle: K;
        }>>;
        update: Updateable<Extract<RegistryEntry, {
            handle: K;
        }>>;
        delete: Deleteable<Extract<RegistryEntry, {
            handle: K;
        }>>;
        query: Queryable<Extract<RegistryEntry, {
            handle: K;
        }>>;
    };
};
type QboAccounting = ApiEntities & {
    batch: Batch;
};
type RegistryEntry = (typeof registry)[number];
export interface QboConnector extends ConnectorConstuctorOptions {
    endpoints: {
        authorization_endpoint: string;
        token_endpoint: string;
        revocation_endpoint: string;
    } | null;
    registry: RegistryEntry[];
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
export declare class QboConnector extends EventEmitter {
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
    constructor(config: ConnectorConstuctorOptions);
    /**
     * Sets the credentials on the connector. If any of the creds properties are missing,
     * the corresponding internal property will NOT be set.
     * @param {object} creds
     * @param {string} creds.access_token the Intuit access token
     * @param {string} creds.realm_id the Intuit realm (company id)
     * @param {string} creds.refresh_token the Intuit refresh token
     */
    setCredentials(creds: Partial<Credentials>): void;
    loadDiscoveryInfo(): Promise<void>;
    /**
     * Get the object through which you can interact with the QuickBooks Online Accounting API.
     */
    accountingApi(): Partial<ApiEntities> & {
        batch: (payload: any) => any;
    };
    /**
      Sends any GET request for API calls. Includes token refresh retry capabilities.
      @param {string} entityName the name of the entity in the registry.
      @param {string} uri (after base url).
      @param {object} qs query string hash
    */
    _get(entityName: any, uri: any, qs: any): Promise<any>;
    _post(entityName: any, uri: any, qs: any, body: any): Promise<any>;
    _batch(body: any): Promise<any>;
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
    doFetch(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, query: {
        [key: string]: string;
    }, payload: any, options?: {
        headers?: FetchOptions['headers'];
        entityName?: string;
        retries?: number;
    }): any;
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
    getAccessToken(code?: any, realm_id?: any): Promise<Partial<Credentials>>;
    /**
     * Disconnects the user from Intuit QBO API (invalidates the access token and request token).
     * After calling this method, the user will be forced to authenticate again.
     * Emits the "token.revoked" event, handing back the data passed back from QBO.
     */
    disconnect(): Promise<string>;
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
    getIntuitAuthorizationUrl(state: any): Promise<string>;
}
export interface ApiError extends Error {
    payload: any;
    intuit_tid: string;
}
/** An API error from the connector, typically including a captured `payload` object you can work with to obtain more information about the error and how to handle it. */
export declare class ApiError extends Error {
    constructor(msg: any, payload: any, intuit_tid: any);
}
/** Specific type of API error indicating the API request limit has been reached. */
export declare class ApiThrottlingError extends ApiError {
    constructor(msg: any, payload: any, intuit_tid: any);
}
export declare class CredentialsError extends Error {
}
export {};
