import axiosRetry from "axios-retry"
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer,
  type InternalAxiosRequestConfig,
  type Method
} from "axios"
import { stringify } from "qs"

const defaultConfig: AxiosRequestConfig = {
  baseURL: "/api/ALS/Web",
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
}

class Http {
  private static instance: AxiosInstance = axios.create(defaultConfig)
  constructor() {
    axiosRetry(Http.instance, { retries: 3 /*, retryDelay: 1000 */ })
    this.interceptors()
  }

  public async request<T>(config: AxiosRequestConfig & { token?: string; method?: Method }): Promise<T> {
    // oxlint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const res = await Http.instance.request<T>(config)
        resolve(res?.data || ({} as T))
      } catch (error) {
        reject(error)
      }
    })
  }

  private interceptors() {
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  // 請求攔截
  private interceptorsRequest() {
    Http.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config
      },
      error => {
        console.error("請求失敗")
        return Promise.reject(error)
      }
    )
  }

  // 響應攔截
  private interceptorsResponse() {
    Http.instance.interceptors.response.use(
      async response => {
        return response
      },
      error => {
        const {
          response: { status, data }
        } = error
        const { message } = data
        return Promise.reject(error.response)
      }
    )
  }
}

export const useHttp = new Http()
