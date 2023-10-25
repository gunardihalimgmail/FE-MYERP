import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../../models/CommonModel";
import history from "../../../utils/history";

const hrAxios = axios.create(
    {
        baseURL: "http://192.168.1.121:9007/api/", 
        // baseURL: "https://192.168.11.44:9007/api/",
        // baseURL: 'https://localhost:6004/api/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
);

hrAxios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        alert('Network error - make sure HR API is running!')
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
    get: (url: string) => hrAxios.get(url).then(responseBody),
    post: (url: string, body: {}) => hrAxios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => hrAxios.put(url, body).then(responseBody),
    del: (url: string) => hrAxios.delete(url).then(responseBody),
};

const ApprovalPengajuanGrade = {
    getListPengajuanGrade: (): Promise<IResponse> => requests.get(`/ApprovalGrade/getpengajuangrade/`),
    getDetailPengajuanGradeKaryawan: (id: number):
        Promise<IResponse> => requests.get(`/ApprovalGrade/getdetailpengajuangradekaryawan/${id}`),
    updateApprovalGradeKaryawan: (param: any): Promise<IResponse> =>
        requests.put('/ApprovalGrade/updateapprovalgrade', param)
};

// const Penutupan = {
//     getPenutupanList: (id_ms_login: any): Promise<IResponse> => requests.get(`/Penutupan/getlistpenutupan/${id_ms_login}`),
//     getDataPenutupanDetailList: (param: any): Promise<IResponse> => requests.post('/Penutupan/getpenutupandetail', param),
//     approvePenutupan: (param: any): Promise<IResponse> => requests.post('/Penutupan/approvepenutupan', param)
// };

export default {
    ApprovalPengajuanGrade,
    // Penutupan
};
