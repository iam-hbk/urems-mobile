import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { WretchError } from "wretch/resolver";

const api = wretch("https://localhost:7089/api")
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
    // console.log("Response", await r.json());
    return r.json();
  });

export default api;
