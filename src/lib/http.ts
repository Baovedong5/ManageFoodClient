import { redirect } from "next/navigation";
import { normalizePath } from "@/lib/utils";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const BADREQUEST_ERROR_STATUS = 400;
const AUTHENTICATION_ERROR_STATUS = 401;

type BadErrorPayload = {
  message: string[];
  error: string;
  statusCode: number;
};

export class HttpError extends Error {
  payload: {
    message: string | string[];
    error: string;
    statusCode: number;
  };

  constructor({
    payload,
    message = "Lỗi HTTP",
  }: {
    payload: any;
    message?: string;
  }) {
    super(message);
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  payload: BadErrorPayload;

  constructor({ payload }: { payload: BadErrorPayload }) {
    super({ payload, message: "Lỗi validate" });
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;

const isClient = typeof window !== "undefined";

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  if (isClient) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      baseHeaders["Authorization"] = `Bearer ${access_token}`;
    }
  }

  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === BADREQUEST_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 400;
          payload: BadErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: null, // Logout mình sẽ cho phép luôn luôn thành công
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            clientLogoutRequest = null;
            // Redirect về trang login có thể dẫn đến loop vô hạn
            // Nếu không không được xử lý đúng cách
            // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
            // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
            location.href = "/login";
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (normalizeUrl === "api/auth/login") {
      const { access_token, refresh_token } = (data as any).payload.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    } else if (normalizeUrl === "api/auth/logout") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};
export default http;
