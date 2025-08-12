import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: this.configService.get<string>('sessionm.endpoint'),
      auth: {
        username: this.configService.get<string>('sessionm.apiKey') ?? '',
        password: this.configService.get<string>('sessionm.secretKey') ?? '',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.log(
          `Making ${config.method?.toUpperCase()} request to ${config.url}`,
        );
        return config;
      },
      (error: any) => {
        this.logger.error('Request error:', error);
        return Promise.reject(
          error instanceof Error
            ? error
            : new Error(error?.message || 'Unknown request error'),
        );
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.log(
          `Response received from ${response.config.url} with status ${response.status}`,
        );
        return response;
      },
      (error) => {
        this.logger.error(
          `Response error from ${error.config?.url}:`,
          error.message,
        );
        return Promise.reject(
          error instanceof Error
            ? error
            : new Error(error?.message || 'Unknown response error'),
        );
      },
    );
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  // Method để tạo instance mới với base URL khác
  createInstance(baseURL: string, config?: AxiosRequestConfig): AxiosInstance {
    return axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    });
  }
}
