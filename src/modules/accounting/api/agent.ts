import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../../models/CommonModel";
import history from "../../../utils/history";

const accountingAxios = axios.create(
    {
        baseURL: "http://192.168.1.121:9010/api/", 
        // baseURL: "https://192.168.11.44:9008/api/",
        // baseURL: 'https://localhost:6007/api/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
);

accountingAxios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
       alert('Network error - make sure Procurement API is running!')
       history.push('');
       window.location.reload();
    }

    const { status, data, config, headers } = error.response;
    
    if (status === 500) {
        alert('Server error - check the terminal for more info!')
    }

    throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => accountingAxios.get(url).then(responseBody),
    post: (url: string, body: {}) => accountingAxios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => accountingAxios.put(url, body).then(responseBody),
    del: (url: string) => accountingAxios.delete(url).then(responseBody),
};

const BKUAccounting = {
    getBKUList: (id_ms_login: any): Promise<IResponse> => requests.get(`/BKU/getbkuacc/${id_ms_login}`),
    getBKUDetail: (param: any): Promise<IResponse> => requests.post('/BKU/getdetailbku', param),
    bkuAccountingApproval: (param: any): Promise<IResponse> => requests.post('/BKU/approvebkuaccounting', param),
};

const Akun = {
    getAkunList: (): Promise<IResponse> => requests.get(`/Akun/getakun`),
    updateAkun: (param: any): Promise<IResponse> => requests.post('/Akun/updateAkunDokumen', param),
};


export default {
    BKUAccounting,
    Akun
};
