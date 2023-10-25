import axios, { AxiosResponse } from "axios";
import { IResponse } from "../models/CommonModel";
import history from "../utils/history";

const authenticationAxios = axios.create({
  baseURL: "http://192.168.1.121:9006/api/",
  // baseURL: "http://192.168.11.149:1047/api/",

  // baseURL: "https://192.168.11.44:9006/api/",
  //  baseURL: "https://localhost:6001/api/",
});

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    alert("Network error - make sure Authentication API is running!");
    history.push("");
    window.location.reload();
  }

  const { status, data, config, headers } = error.response;

  if (status === 500) {
    alert("Server error - check the terminal for more info!");
  }

  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => authenticationAxios.get(url).then(responseBody),
  post: (url: string, body: {}) => authenticationAxios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => authenticationAxios.put(url, body).then(responseBody),
  del: (url: string) => authenticationAxios.delete(url).then(responseBody),
};

const GeneralList = {
  listCount: (param: any): Promise<IResponse> => requests.post('/menu/getlistcount', param), 
};

const Authentication = {
  login: (login: any): Promise<IResponse> => requests.post("/authentication/login", login),
  menu: (id_ms_group: any): Promise<IResponse> => requests.post("/menu/menu", id_ms_group),

  changepassword: (param: any): Promise<IResponse> => requests.post("/authentication/changepassword", param),
};

const UnitUsaha = {
  listUnitUsahaKode: (): Promise<IResponse> => requests.get("/unitusaha/getunitusahakodeall")
};

export default {
  GeneralList,
  Authentication,
  UnitUsaha
};
