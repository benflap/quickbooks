/// <reference types="node" />
import { EventEmitter } from 'node:events';
export declare const PRODUCTION_API_BASE_URL = "https://quickbooks.api.intuit.com";
export declare const SANDBOX_API_BASE_URL = "https://sandbox-quickbooks.api.intuit.com";
import { type RequestInit } from 'node-fetch';
declare const registry: readonly [{
    readonly handle: "Bill";
    readonly name: "Bill";
    readonly fragment: "bill";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "BillPayment";
    readonly name: "BillPayment";
    readonly fragment: "billpayment";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "CreditMemo";
    readonly name: "CreditMemo";
    readonly fragment: "creditmemo";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Deposit";
    readonly name: "Deposit";
    readonly fragment: "deposit";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Estimate";
    readonly name: "Estimate";
    readonly fragment: "estimate";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Invoice";
    readonly name: "Invoice";
    readonly fragment: "invoice";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "JournalEntry";
    readonly name: "JournalEntry";
    readonly fragment: "journalentry";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Payment";
    readonly name: "Payment";
    readonly fragment: "payment";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Purchase";
    readonly name: "Purchase";
    readonly fragment: "purchase";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Purchaseorder";
    readonly name: "Purchaseorder";
    readonly fragment: "purchaseorder";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "RefundReceipt";
    readonly name: "RefundReceipt";
    readonly fragment: "refundreceipt";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "SalesReceipt";
    readonly name: "SalesReceipt";
    readonly fragment: "salesreceipt";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "TimeActivity";
    readonly name: "TimeActivity";
    readonly fragment: "timeactivity";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Transfer";
    readonly name: "Transfer";
    readonly fragment: "transfer";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "VendorCredit";
    readonly name: "VendorCredit";
    readonly fragment: "vendorcredit";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Account";
    readonly name: "Account";
    readonly fragment: "account";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "Budget";
    readonly name: "Budget";
    readonly fragment: "budget";
    readonly query: true;
    readonly create: false;
    readonly read: true;
    readonly update: false;
    readonly delete: false;
}, {
    readonly handle: "Class";
    readonly name: "Class";
    readonly fragment: "class";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "CompanyCurrency";
    readonly name: "CompanyCurrency";
    readonly fragment: "companycurrency";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "Customer";
    readonly name: "Customer";
    readonly fragment: "customer";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "Department";
    readonly name: "Department";
    readonly fragment: "department";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "Employee";
    readonly name: "Employee";
    readonly fragment: "employee";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "Item";
    readonly name: "Item";
    readonly fragment: "item";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "Journalcode";
    readonly name: "Journalcode";
    readonly fragment: "journalcode";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "PaymentMethod";
    readonly name: "PaymentMethod";
    readonly fragment: "paymentmethod";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "TaxAgency";
    readonly name: "TaxAgency";
    readonly fragment: "taxagency";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: false;
    readonly delete: false;
}, {
    readonly handle: "TaxCode";
    readonly name: "TaxCode";
    readonly fragment: "taxcode";
    readonly query: true;
    readonly create: false;
    readonly read: true;
    readonly update: false;
    readonly delete: false;
}, {
    readonly handle: "TaxRate";
    readonly name: "TaxRate";
    readonly fragment: "taxrate";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: false;
    readonly delete: false;
}, {
    readonly handle: "TaxService";
    readonly name: "TaxService";
    readonly fragment: "taxservice/taxcode";
    readonly query: false;
    readonly create: true;
    readonly read: false;
    readonly update: false;
    readonly delete: false;
}, {
    readonly handle: "Term";
    readonly name: "Term";
    readonly fragment: "term";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "Vendor";
    readonly name: "Vendor";
    readonly fragment: "vendor";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "Attachable";
    readonly name: "Attachable";
    readonly fragment: "attachable";
    readonly query: true;
    readonly create: true;
    readonly read: true;
    readonly update: true;
    readonly delete: true;
}, {
    readonly handle: "CompanyInfo";
    readonly name: "CompanyInfo";
    readonly fragment: "companyinfo";
    readonly query: true;
    readonly create: false;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "ExchangeRate";
    readonly name: "ExchangeRate";
    readonly fragment: "exchangerate";
    readonly query: true;
    readonly create: false;
    readonly read: false;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "Preferences";
    readonly name: "Preferences";
    readonly fragment: "preferences";
    readonly query: true;
    readonly create: false;
    readonly read: true;
    readonly update: true;
    readonly delete: false;
}, {
    readonly handle: "AccountListDetailReport";
    readonly name: "AccountList";
    readonly fragment: "AccountList";
    readonly report: true;
}, {
    readonly handle: "APAgingDetailReport";
    readonly name: "AgedPayableDetail";
    readonly fragment: "AgedPayableDetail";
    readonly report: true;
}, {
    readonly handle: "APAgingSummaryReport";
    readonly name: "AgedPayables";
    readonly fragment: "AgedPayables";
    readonly report: true;
}, {
    readonly handle: "ARAgingDetailReport";
    readonly name: "AgedReceivableDetail";
    readonly fragment: "AgedReceivableDetail";
    readonly report: true;
}, {
    readonly handle: "ARAgingSummaryReport";
    readonly name: "AgedReceivables";
    readonly fragment: "AgedReceivables";
    readonly report: true;
}, {
    readonly handle: "BalanceSheetReport";
    readonly name: "BalanceSheet";
    readonly fragment: "BalanceSheet";
    readonly report: true;
}, {
    readonly handle: "CashFlowReport";
    readonly name: "CashFlow";
    readonly fragment: "CashFlow";
    readonly report: true;
}, {
    readonly handle: "CustomerBalanceReport";
    readonly name: "CustomerBalance";
    readonly fragment: "CustomerBalance";
    readonly report: true;
}, {
    readonly handle: "CustomerBalanceDetailReport";
    readonly name: "CustomerBalanceDetail";
    readonly fragment: "CustomerBalanceDetail";
    readonly report: true;
}, {
    readonly handle: "CustomerIncomeReport";
    readonly name: "CustomerIncome";
    readonly fragment: "CustomerIncome";
    readonly report: true;
}, {
    readonly handle: "GeneralLedgerReport";
    readonly name: "GeneralLedger";
    readonly fragment: "GeneralLedger";
    readonly report: true;
}, {
    readonly handle: "GeneralLedgerReportFR";
    readonly name: "GeneralLedgerFR";
    readonly fragment: "GeneralLedgerFR";
    readonly report: true;
}, {
    readonly handle: "InventoryValuationSummaryReport";
    readonly name: "InventoryValuationSummary";
    readonly fragment: "InventoryValuationSummary";
    readonly report: true;
}, {
    readonly handle: "JournalReport";
    readonly name: "JournalReport";
    readonly fragment: "JournalReport";
    readonly report: true;
}, {
    readonly handle: "ProfitAndLossReport";
    readonly name: "ProfitAndLoss";
    readonly fragment: "ProfitAndLoss";
    readonly report: true;
}, {
    readonly handle: "ProfitAndLossDetailReport";
    readonly name: "ProfitAndLossDetail";
    readonly fragment: "ProfitAndLossDetail";
    readonly report: true;
}, {
    readonly handle: "SalesByClassSummaryReport";
    readonly name: "ClassSales";
    readonly fragment: "ClassSales";
    readonly report: true;
}, {
    readonly handle: "SalesByCustomerReport";
    readonly name: "CustomerSales";
    readonly fragment: "CustomerSales";
    readonly report: true;
}, {
    readonly handle: "SalesByDepartmentReport";
    readonly name: "DepartmentSales";
    readonly fragment: "DepartmentSales";
    readonly report: true;
}, {
    readonly handle: "SalesByProductReport";
    readonly name: "ItemSales";
    readonly fragment: "ItemSales";
    readonly report: true;
}, {
    readonly handle: "TaxSummaryReport";
    readonly name: "TaxSummary";
    readonly fragment: "TaxSummary";
    readonly report: true;
}, {
    readonly handle: "TransactionListReport";
    readonly name: "TransactionList";
    readonly fragment: "TransactionList";
    readonly report: true;
}, {
    readonly handle: "TransactionListWithSplitsReport";
    readonly name: "TransactionListWithSplits";
    readonly fragment: "TransactionListWithSplits";
    readonly report: true;
}, {
    readonly handle: "TrialBalanceReportFR";
    readonly name: "TrialBalanceFR";
    readonly fragment: "TrialBalanceFR";
    readonly report: true;
}, {
    readonly handle: "TrialBalanceReport";
    readonly name: "TrialBalance";
    readonly fragment: "TrialBalance";
    readonly report: true;
}, {
    readonly handle: "VendorBalanceReport";
    readonly name: "VendorBalance";
    readonly fragment: "VendorBalance";
    readonly report: true;
}, {
    readonly handle: "VendorBalanceDetailReport";
    readonly name: "VendorBalanceDetail";
    readonly fragment: "VendorBalanceDetail";
    readonly report: true;
}, {
    readonly handle: "VendorExpensesReport";
    readonly name: "VendorExpenses";
    readonly fragment: "VendorExpenses";
    readonly report: true;
}];
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
type QueryableReport<TEntity> = TEntity extends {
    report: true;
} ? ReportQuery : never;
type ReportQuery = (params: {
    [key: string]: string;
}, options?: FunctionOptions) => Promise<any>;
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
        }>> | QueryableReport<Extract<RegistryEntry, {
            handle: K;
        }>>;
    };
};
type QboAccounting = ApiEntities & {
    batch: Batch;
};
type RegistryEntry = (typeof registry)[number];
interface QboConnector extends ConnectorConstuctorOptions {
    endpoints: {
        authorization_endpoint: string;
        token_endpoint: string;
        revocation_endpoint: string;
    } | null;
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
declare class QboConnector extends EventEmitter {
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
    accountingApi(): QboAccounting;
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
interface ApiError extends Error {
    payload: any;
    intuit_tid: string;
}
/** An API error from the connector, typically including a captured `payload` object you can work with to obtain more information about the error and how to handle it. */
declare class ApiError extends Error {
    constructor(msg: any, payload: any, intuit_tid: any);
}
/** Specific type of API error indicating the API request limit has been reached. */
declare class ApiThrottlingError extends ApiError {
    constructor(msg: any, payload: any, intuit_tid: any);
}
declare class ApiAuthError extends Error {
}
declare class CredentialsError extends Error {
}
export { ApiError, ApiThrottlingError, ApiAuthError, CredentialsError, QboConnector, };
