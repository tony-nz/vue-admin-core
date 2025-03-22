import { App } from "vue";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "axios";
import useAppStore from "../../store/app";
import useAuthStore from "../../store/auth";
import VueAxios from "vue-axios";

const BASE_URL = "http://localhost:8000";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description response interceptor reference
   */
  private static responseInterceptor: number | null = null;

  /**
   * @description abort controller for cancelling requests
   */
  private static abortController: AbortController | null = null;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    const appStore = useAppStore();
    const authStore = useAuthStore();

    ApiService.abortController = new AbortController();
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL = authStore.getConfig(
      "api.baseURL"
    )
      ? authStore.getConfig("api.baseURL")
      : BASE_URL;
    ApiService.vueInstance.axios.defaults.withCredentials = true;
    ApiService.vueInstance.axios.defaults.withXSRFToken = true;
    ApiService.vueInstance.axios.defaults.signal =
      ApiService.abortController.signal;

    // Add response interceptor
    ApiService.responseInterceptor =
      ApiService.vueInstance.axios.interceptors.response.use(
        (response) => {
          return response;
        },
        function (error) {
          if (error.message.includes("Network Error")) {
            appStore.showToast({
              severity: "error",
              summary: "Error",
              message:
                "Connection refused. Please check your internet connection.",
            });
          }
          if (
            error.response &&
            [401, 419].includes(error.response.status) &&
            authStore.getUser
          ) {
            authStore.purgeAuth();
          }
          return Promise.reject(error);
        }
      );
  }

  /**
   * @description cleanup axios interceptors and abort pending requests
   */
  public static cleanup() {
    if (ApiService.abortController) {
      ApiService.abortController.abort();
      ApiService.abortController = null;
    }
    if (ApiService.responseInterceptor !== null) {
      ApiService.vueInstance.axios.interceptors.response.eject(
        ApiService.responseInterceptor
      );
      ApiService.responseInterceptor = null;
    }
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(token: string): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    params = {} as AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(`${resource}`, { params });
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static create(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string, slug: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(`${resource}/${slug}`);
  }

  /**
   * @description Send the bulk DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static bulkDelete(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(`${resource}`, params);
  }

  /**
   * @description Mass update resources via id
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<any>
   */
  public static updateMany(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<any> {
    return Promise.all(
      params.data.ids.map((id) =>
        ApiService.vueInstance.axios.put(`${resource}/${id}`, params.data)
      )
    );
  }

  /**
   * @description Mass update resources via id
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<any>
   */
  public static deleteMany(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<any> {
    return ApiService.vueInstance.axios.post(`${resource}/bulkDelete`, params);
  }
}

export default ApiService;
