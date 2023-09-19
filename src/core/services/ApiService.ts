import { App } from "vue";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "axios";
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
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    const authStore = useAuthStore();

    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL = authStore.AuthConfig(
      "api.baseURL"
    )
      ? authStore.AuthConfig("api.baseURL")
      : BASE_URL;
    ApiService.vueInstance.axios.defaults.withCredentials = true;
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    const cookies = document.cookie.split(";");
    const token = cookies.find((cookie) => {
      return cookie.trim().startsWith("XSRF-TOKEN=");
    });

    ApiService.vueInstance.axios.defaults.headers.common[
      "Access-Control-Allow-Origin"
    ] = "*";
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Token ${token}`;
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
    return ApiService.vueInstance.axios.get(resource, params).catch((error) => {
      throw new Error(`[VUEADMIN] ApiService ${error}`);
    });
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    // slug = "" as string,
    params = [] as AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return (
      ApiService.vueInstance.axios
        // .get(`${resource}/${slug}`, params)
        .get(`${resource}`, params)
        .catch((error) => {
          throw new Error(`[VUEADMIN] ApiService ${error}`);
        })
    );
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
    return ApiService.vueInstance.axios
      .delete(`${resource}/${slug}`)
      .catch((error) => {
        throw new Error(`[VUEADMIN] ApiService ${error}`);
      });
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
    return ApiService.vueInstance.axios
      .delete(`${resource}`, params)
      .catch((error) => {
        throw new Error(`[VUEADMIN] ApiService ${error}`);
      });
  }

  /**
   * @description Mass update resources via id
   * @param resource: string
   * @param slug: string
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
   * @param slug: string
   * @returns Promise<any>
   */
  public static deleteMany(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<any> {
    return ApiService.vueInstance.axios.post(`${resource}/bulkDelete`, params);
    // return Promise.all(
    //   params.data.forEach(item => {
    //     ApiService.vueInstance.axios.delete(`${resource}/${item['id']}`);
    //   })
    // );
  }
}

export default ApiService;
