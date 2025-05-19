import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { WretchError } from "wretch/resolver";


export const UREM__ERP_API_BASE: string = "http://localhost:7089"
// export const UREM__ERP_API_BASE: string = "https://urems-backend-dev.up.railway.app"

const api = wretch(`${UREM__ERP_API_BASE}/api`)
  .catcher(400, (error: WretchError) => {
    console.error("Bad request:", error.message);
    throw new Error("Bad request: " + error.message);
  })
  .catcher(401, (error: WretchError) => {
    console.error("Unauthorized:", error.message);
    throw new Error("Unauthorized access: " + error.message);
  })
  .catcher(404, (error: WretchError) => {
    console.error("Not found:", error.message);
    throw new Error("Resource not found: " + error.message);
  })
  .catcher(500, (error: WretchError) => {
    console.error("Server error:", error.message);
    throw new Error("Internal server error: " + error.message);
  })
  .addon(QueryStringAddon)
  .errorType("json")
  .content("application/json")
  .resolve(async (r) => {
    return r.json();
  });

export default api;
