import axios from "axios";
import { toast } from "react-toastify";
import createAuthRefreshInterceptor from "axios-auth-refresh";

/// this function refresh Request Token when user login and logout
export function refreshRequestToken() {
  axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
    "tokenKey"
  );
}
refreshRequestToken();

/// baseURL
axios.defaults.baseURL = `http://localhost:3001/api`;

/// when server sends error >= 403  show in page An unexpected error occurred
axios.interceptors.response.use(null, (err) => {
  if (err.response && err.response.status >= 403) {
    toast.error(`An unexpected error occurred`);
  }
  return Promise.reject(err);
});

////// check if the token expired return refresh_Token and if refresh Token expired return the user to log in
const refreshAuthLogic = async (failedRequest) => {
  return axios
    .post("/auth/refreshToken", {
      refreshToken: localStorage.getItem("refreshTokenKey"),
    })
    .then((tokenRefreshResponse) => {
      localStorage.setItem("tokenKey", tokenRefreshResponse.data.token);
      localStorage.setItem(
        "refreshTokenKey",
        tokenRefreshResponse.data.refreshToken
      );
      axios.defaults.headers.common["x-auth-token"] =
        tokenRefreshResponse.data.token;
      failedRequest.response.config.headers["x-auth-token"] =
        tokenRefreshResponse.data.token;
      return Promise.resolve();
    })
    .catch((err) => {
      if (err.response && err.response.status === 400) {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("refreshTokenKey");
        toast.error(`you need to login again`);
        window.location.pathname = "/login";
      }
    });
};

createAuthRefreshInterceptor(axios, refreshAuthLogic);

const service = {
  refreshRequestToken,
  get: axios.get,
  put: axios.put,
  patch: axios.patch,
  post: axios.post,
  delete: axios.delete,
};

export default service;
