import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConnectionError } from './Error';
import { FedaPay } from './FedaPay';

export interface RequestInterceptor {
    callback: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
    onRejected?: (error: any) => any
};

export class Requestor {
    readonly SANDBOX_BASE = 'https://sdx-api.fedapay.com';
    readonly PRODUCTION_BASE = 'https://api.fedapay.com';

    protected apiKey: string;
    protected token: string;
    protected environment: string;
    protected apiVersion: string;
    protected accountId: string | number = '';
    protected static httpClient: AxiosInstance;
    protected static requestInterceptors: RequestInterceptor[] = [];

    constructor() {
        this.apiKey = FedaPay.getApiKey();
        this.token = FedaPay.getToken();
        this.environment = FedaPay.getEnvironment();
        this.apiVersion = FedaPay.getApiVersion();
        this.accountId = FedaPay.getAccountId();
    }

    /**
     * Set the http client isntance
     * @param client AxiosInstance
     */
    static setHttpClient(client: AxiosInstance) {
        Requestor.httpClient = client;
    }

    /**
     * @returns
     */
    private httpClient(): AxiosInstance {
        if (!Requestor.httpClient) {
            let options = {};

            if (FedaPay.getVerifySslCerts()) {
                // TODO Set ca bundle file to the request
            }

            Requestor.httpClient = axios.create(options);
            this.applyRequestInterceptors(Requestor.httpClient);
        }

        return Requestor.httpClient;
    }


    /**
     * Set the http client isntance
     * @param client AxiosInstance
     */
    static addRequestInterceptor(interceptor: RequestInterceptor) {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Apply request interceptor
     * @param httpClient AxiosInstance
     */
    private applyRequestInterceptors(httpClient: AxiosInstance) {
        Requestor.requestInterceptors.forEach(interceptor => {
            httpClient.interceptors.request.use(
                interceptor.callback, interceptor.onRejected
            );
        })
    }

    request(
        method: string,
        path: any,
        params = {},
        headers = {}
    ): Promise<AxiosResponse<any>> {
        let url = this.url(path);
        method = method.toUpperCase();
        headers = Object.assign(this.defaultHeaders(), headers);

        let requestConfig: AxiosRequestConfig = {
            method,
            url,
            headers,
            responseType: 'json'
        }

        if (['GET', 'HEAD', 'DELETE'].indexOf(method) > -1) {
            requestConfig['params'] = params;
        } else {
            requestConfig['data'] = params;
        }

        return this.httpClient().request(requestConfig)
            .catch(this.handleRequestException);
    }

    protected baseUrl() {
        switch (this.environment) {
            case 'development':
            case 'sandbox':
            case 'test':
            case null:
                return this.SANDBOX_BASE;
            case 'production':
            case 'live':
                return this.PRODUCTION_BASE;
        }
    }

    protected handleRequestException(e: any) {
        let message = `Request error: ${e.message}`;
        let httpStatusCode = e.response ? e.response.status : null;
        let httpRequest = e.request;
        let httpResponse = e.response;

        return Promise.reject(new ApiConnectionError(
            message,
            httpStatusCode,
            httpRequest,
            httpResponse
        ));
    }

    protected url(path = '') {
        return `${this.baseUrl()}/${this.apiVersion}${path}`;
    }

    protected defaultHeaders() {
        let _default: any = {
            'X-Version': FedaPay.VERSION,
            'X-Source': 'FedaPay NodeLib',
            'Authorization': 'Bearer ' + (this.apiKey || this.token)
        };

        if (this.accountId) {
            _default['FedaPay-Account'] = this.accountId;
        }

        return _default;
    }
}
