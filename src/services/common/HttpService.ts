import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export class HttpService {
  post<T, P>(
    url: string,
    payload: P,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios.post<P, AxiosResponse<T>>(url, payload, config)
  }

  patch<T, P>(
    url: string,
    payload: P,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios.patch<P, AxiosResponse<T>>(url, payload, config)
  }

  put<T, P>(
    url: string,
    payload: P,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios.put<P, AxiosResponse<T>>(url, payload, config)
  }

  get<T, P>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios.get<P, AxiosResponse<T>>(url, config)
  }

  delete<T, P>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios.delete<P, AxiosResponse<T>>(url, config)
  }
}
