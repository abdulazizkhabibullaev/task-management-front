import axios from 'axios';
import { ElMessage } from 'element-plus';
import { i18n } from '../../plugins/i18n';
import router from '../../router/index';
import type { User } from '../types/user';
import type { TableColumn } from '../types/columns';
import type { ApiResponse, PagingResponse } from '../types/common';
import myLocalStorage from '../utils/local-storage';
import myCookie from '../utils/my-cookie';

export class Api {
  client: any;
  query: any;
  queryString: string;
  apiUrl: string | undefined;
  token: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_BASE_URL;
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 5 * 60 * 1000,
    });
    this.query = {};
    this.queryString = '';
    this.client.defaults.params = {};
    this.setInterceptors();
    this.token = '';
  }

  setInterceptors() {
    this.client.interceptors.response.use(
      async function (resp: ApiResponse<any>) {
        return resp.data;
      },
      (err: any) => {
        const errorResponse = err.response;
        const error = errorResponse ? (errorResponse.data as ApiResponse<any>) : null;
        if (error) {
          error.status_code = errorResponse ? errorResponse.status : 400;
          console.error(' [API err]: ', err);

          if (error.status_code === 401) {
            myCookie.clear();
            window.location.reload();
            router.push({ name: 'login' });
            return;
          }

          try {
            ElMessage.error(error.message);
          } catch (e) {
            console.log('#onMessageError', e);
          }

          return Promise.reject(error);
        } else {
          ElMessage.error(i18n.global.t('SERVER.CONNECTION_ERROR'));
        }

        return Promise.reject(err);
      },
    );
  }

  async execute<T>(
    method: string,
    url: string,
    data: object | null,
    query: object | null = null,
    onUploadProgress: number | null = null,
  ): Promise<T> {
    const token = myCookie.getToken() ?? myLocalStorage.getToken();

    if (router.currentRoute.value.meta?.auth && !token) {
      router.push({ name: 'login' });
      throw new Error('unauthorized');
    }

    const headers: Record<string, any> = {
      Authorization: `Bearer ${token}`,
      'Accept-Language': myCookie.get('lang'),
    };

    if (query) {
      url += this.makeQueryString(query);
    }
    try {
      const resp = (await this.client({
        method,
        url,
        data,
        headers,
        onUploadProgress,
      })) as ApiResponse<T>;

      return resp?.data;
    } catch (err) {
      console.log('#onError', err);
      throw err;
    }
  }

  setQuery(key: string, value: string) {
    if (!this.query) {
      this.query = {};
    }
    this.query[key] = value;
    this.queryString = '';

    // eslint-disable-next-line
    for (const i in this.query) {
      if (this.queryString == '') {
        this.queryString = '?';
      } else {
        this.queryString += '&';
      }

      this.queryString += `${i}=${this.query[i]}`;
    }
  }

  async upload(url: string, formData: object) {
    const token = myCookie.getToken();
    if (token === null) {
      router.push({ name: 'login' });
    } else {
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      };

      const resp = await axios.post(this.apiUrl + url, formData, { headers });

      if (!resp.data || !resp.data.data) {
        try {
          ElMessage.error('INTERNAL_SERVER_ERROR');
        } catch (err2) {
          console.error(err2);
        }
        return null;
      }

      return resp.data.data;
    }
  }

  makeQueryString(params: any) {
    let queryString = '';

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== '' && params[key] !== undefined) {
        let value = params[key];
        if (typeof value === 'string') {
          value = encodeURI(value);
        }
        queryString = `${queryString + key}=${value}&`;
      }
    });
    queryString = queryString.slice(0, -1);
    queryString = queryString ? `?${queryString}` : queryString;

    return queryString;
  }

  getPagingData(url: string, payload: any, method = 'post') {
    return this.execute<PagingResponse<any>>(
      method,
      url,
      method === 'get' ? null : payload,
      method === 'get' ? payload : null,
      null,
    );
  }

  getChoose(method: string, url: string, payload: any) {
    return this.execute<any>(
      method,
      url,
      method === 'get' ? null : payload,
      method === 'get' ? payload : null,
      null,
    );
  }
}
