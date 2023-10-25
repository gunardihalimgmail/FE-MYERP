import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../../models/CommonModel";
import history from "../../../utils/history";

const agronomiAxios = axios.create(
    {
        baseURL: "http://192.168.1.121:9008/api/", 
        // baseURL: "http://192.168.11.44:7887/api/",
        // baseURL: 'https://localhost:6011/api/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
);

agronomiAxios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
       alert('Network error - make sure Agronomi API is running!')
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
    get: (url: string) => agronomiAxios.get(url).then(responseBody),
    post: (url: string, body: {}) => agronomiAxios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => agronomiAxios.put(url, body).then(responseBody),
    del: (url: string) => agronomiAxios.delete(url).then(responseBody),
};

const PasData = {
    getPasList: (periode: any): Promise<IResponse> => requests.get(`/PAS/getlistpas/${periode}`),
    getDetailPasList: (id_ag_pas: any, id_ms_login: any): Promise<IResponse> => requests.get(`/PAS/getdetailpas/${id_ag_pas}/${id_ms_login}`),
    getDetailHeaderPas: (id_ag_pas: any): Promise<IResponse> => requests.get(`/PAS/getheaderpas/${id_ag_pas}`),
    getDetailRealisasiPasList: (id_ag_pas: any): Promise<IResponse> => requests.get(`/PAS/getrealisasipas/${id_ag_pas}`),
    getDescAttachPasList: (id_ag_pas: any): Promise<IResponse> => requests.get(`/PAS/getfilenameatchpas/${id_ag_pas}`),


    getPeriodeListPas: (): Promise<IResponse> => requests.get(`/PAS/getlistperiodepas`),
    getOpsiPtListpas: (): Promise<IResponse> => requests.get(`/PAS/getopsipt`),
    getMingguListpas: (IdPengaturanPeriode: any): Promise<IResponse> => requests.get(`/PAS/getminggupas/${IdPengaturanPeriode}`),

    postUpdateComment: (param: any): Promise<IResponse> => requests.post('/PAS/insertcomment', param),
    postDeleteFile: (param: any): Promise<IResponse> => requests.post('/PAS/deletepasscan', param),
    postUploadFile: (param: any): Promise<IResponse> => requests.put('/PAS/uploadpasscan', param),

    postGetHistoryPasList: (param: any): Promise<IResponse> => requests.post('/PAS/getlisthistorypas', param),
    
};



export default {
    PasData
};
