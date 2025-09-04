
// src/lib/wretch.ts
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { ok, err, type Result } from "neverthrow";
import type { ApiError } from "@/types/api";

const isProd = process.env.NODE_ENV === "production";
export const API_BASE_URL =
  (isProd
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL_) ?? "http://localhost:7089";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
const toResult = async <T>(res: Response): Promise<Result<T, ApiError>> => {
  try {

    const json = (await res.json().catch(() => ({}))) as unknown;

    if (res.ok) {
      // Check if the API response is wrapped in a "value" property and unwrap it
      const data =
        json && typeof json === "object" && "value" in json
          ? (json as { value: T }).value
          : (json as T);

      return ok(data);
    } else {
      return err(json as ApiError);
    }
  } catch (e) {
    return err({
      type: "NetworkError",
      title: "Network / parsing error",
      status: 0,
      detail: e instanceof Error ? e.message : "Unknown error",
    });
  }
};

/* -------------------------------------------------------------------------- */
/* Base wretch instance                                                       */
/* -------------------------------------------------------------------------- */
const base = wretch(API_BASE_URL + "/api", { mode: "cors" })
  .addon(QueryStringAddon)
  .options({ credentials: "include" }) // send the HttpOnly cookie
  .content("application/json"); // default Content-Type

/* -------------------------------------------------------------------------- */
/* Public API – strongly typed helpers                                        */
/* -------------------------------------------------------------------------- */
export const api = {
  get: <T>(url: string) =>
    base
      .url(url)
      .get()
      .res((r) => toResult<T>(r)),
  del: <T>(url: string) =>
    base
      .url(url)
      .delete()
      .res((r) => toResult<T>(r)),
  post: <T, B = unknown>(url: string, body: B) =>
    base
      .url(url)
      .post(body)
      .res((r) => toResult<T>(r)),
  put: <T, B = unknown>(url: string, body: B) =>
    base
      .url(url)
      .put(body)
      .res((r) => toResult<T>(r)),
  patch: <T, B = unknown>(url: string, body: B) =>
    base
      .url(url)
      .patch(body)
      .res((r) => toResult<T>(r)),
  // auth: (token: string) => base.auth(`Bearer ${token}`),
  // options: (options: RequestInit) => base.options(options),
};

/* Convenience alias for hooks */
export type ApiResult<T> = Promise<Result<T, ApiError>>;
export default api;
