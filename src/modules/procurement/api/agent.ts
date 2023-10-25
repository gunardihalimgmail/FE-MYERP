import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../../models/CommonModel";
import history from "../../../utils/history";

const procurementAxios = axios.create(
    {
        baseURL: "http://192.168.1.121:9011/api/",   // live
        // baseURL: "http://192.168.11.149:9011/api/",   // dev local
        // baseURL: "https://localhost:44332/api/",   // dev local (project vs 2019)
        // baseURL: "https://192.168.11.44:9007/api/",
        // baseURL: 'https://localhost:6003/api/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
);

procurementAxios.interceptors.response.use(undefined, error => {
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
    get: (url: string) => procurementAxios.get(url).then(responseBody),
    post: (url: string, body: {}) => procurementAxios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => procurementAxios.put(url, body).then(responseBody),
    del: (url: string) => procurementAxios.delete(url).then(responseBody),
};

const ApprovalOP = {
    getOPList: (id_ms_login: any): Promise<IResponse> => requests.get(`/OPApproval/getlistop/${id_ms_login}`),
    getDataOPDetailCompareList: (param: any): Promise<IResponse> => requests.post('/OPApproval/getopdetailcompare', param),
    approveOP: (param: any): Promise<IResponse> => requests.post('/OPApproval/approveop', param),
    getDataListCount: (param: any): Promise<IResponse> => requests.post('/OPApproval/getlistdatacount', param)
};

const Penutupan = {
    getPenutupanList: (id_ms_login: any): Promise<IResponse> => requests.get(`/Penutupan/getlistpenutupan/${id_ms_login}`),
    getDataPenutupanDetailList: (param: any): Promise<IResponse> => requests.post('/Penutupan/getpenutupandetail', param),
    approvePenutupan: (param: any): Promise<IResponse> => requests.post('/Penutupan/approvepenutupan', param)

};

const ApprovalTTIS = {
    getOsTTISList: (id_ms_login: any): Promise<IResponse> => requests.get(`/TTISApproval/getlistoutstandingttis/${id_ms_login}`),
    getDtlTTISList: (id_ps_ttis: any): Promise<IResponse> => requests.get(`/TTISApproval/getdetailttis/${id_ps_ttis}`),
    getHstOPTTISList: (id_ps_ttis: any): Promise<IResponse> => requests.get(`/TTISApproval/gethistoryop/${id_ps_ttis}`),
    getHstLPBTTISList: (id_ps_ttis: any): Promise<IResponse> => requests.get(`/TTISApproval/gethistorylpb/${id_ps_ttis}`),
    approveTTIS: (param: any): Promise<IResponse> => requests.post('/TTISApproval/approvettis', param),
    approveMultipleTTIS: (param: any): Promise<IResponse> => requests.post('/TTISApproval/approvemultiplettis', param)
};

const ListOP = {
    getListOP: (param: any)
        : Promise<IResponse> => requests.post('/ListOP/getlistdokumenop', param),
    // getListOPDetail: (id: number)
    getListOPDetail: (param: any)
        : Promise<IResponse> => requests.post(`/ListOP/getdokflowstatusOP`, param)
        // : Promise<IResponse> => requests.get(`/ListOP/getdokflowstatusOP/${id}`)
};

export default {
    ApprovalOP,
    Penutupan, 
    ApprovalTTIS,
    ListOP
};
