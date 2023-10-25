import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../../models/CommonModel";
import history from "../../../utils/history";

const memoAxios = axios.create({
  baseURL: "http://192.168.1.121:9012/api/",
  // baseURL: "https://192.168.11.44:9013/api/",
  // baseURL: 'https://localhost:6013/api/',
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.token,
  },
});

memoAxios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    alert("Network error - make sure Memo API is running!");
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
    get: (url: string) => memoAxios.get(url).then(responseBody),
    post: (url: string, body: {}) => memoAxios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => memoAxios.put(url, body).then(responseBody),
    del: (url: string) => memoAxios.delete(url).then(responseBody),
};

const ListMemo = {
    getListJenisDokumen: (): Promise<IResponse> => requests.get(`/Memo/getjenisdokumen`),
    getListKategoriDokumen: (): Promise<IResponse> => requests.get(`/Memo/getkategoridokumen`),
    getListSubKategoriDokumen: (IdMsKategoriDokumen: Number): Promise<IResponse> => requests.get(`/Memo/getsubkategoridokumen/${IdMsKategoriDokumen}`),
    getDokumenByNomor: (nomor: String): Promise<IResponse> => requests.get(`/Memo/getdokumenbynomor/${nomor}`),
    
    buatDokumenIOM: (param: any): Promise<IResponse> => requests.post('/Memo/buatdokumeniom', param),
    updateDokumenIOM: (param: any): Promise<IResponse> => requests.post('/Memo/updatedokumeniom', param),
    rejectDokumenPengajuan: (param: any): Promise<IResponse> => requests.post('/Memo/rejectdokumenpengajuan', param),
    createDokumenReadHistory: (param: any): Promise<IResponse> => requests.post('/Memo/createdokumenreadhistory', param),
    
    
    getListDokumenOutstanding: (param: any): Promise<IResponse> => requests.post('/Memo/getoutstandingdokumen', param),
    getListDokumenIOM: (param: any): Promise<IResponse> => requests.post('/Memo/getlistdokumeniom', param),
    getListDokumenPengajuan: (param: any): Promise<IResponse> => requests.post('/Memo/getlistdokumenpengajuan', param),
    
    getDetailDokumenIOM: (IdDokumen: Number): Promise<IResponse> => requests.get(`/Memo/getdetaildokumeniom/${IdDokumen}`),
    getDetailDokumenPengajuan: (IdDokumen: Number): Promise<IResponse> => requests.get(`/Memo/getdetaildokumenpengajuan/${IdDokumen}`),
    
    
};

export default {
    ListMemo
};
