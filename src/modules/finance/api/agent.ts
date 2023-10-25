import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../../models/CommonModel";
import history from "../../../utils/history";

const financeAxios = axios.create(
    {
        baseURL: "http://192.168.1.121:9009/api/",  // live
        // baseURL: "http://192.168.11.149:9009/api/",  // dev
        // baseURL: "https://localhost:6009/api/",  // local vs
        // baseURL: "https://192.168.11.44:9009/api/",
        // baseURL: 'https://localhost:6009/api/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
);

financeAxios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
       alert('Network error - make sure Finance API is running!')
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
    get: (url: string) => financeAxios.get(url).then(responseBody),
    post: (url: string, body: {}) => financeAxios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => financeAxios.put(url, body).then(responseBody),
    del: (url: string) => financeAxios.delete(url).then(responseBody),
};

const ApprovalBKU = {
    getBKUList: (id_ms_login: any): Promise<IResponse> => requests.get(`/ApprovalBKU/getbkuappr/${id_ms_login}`),
    getBKUDetailOpLpb: (nomor: any): Promise<IResponse> => requests.get(`/ApprovalBKU/getdetailbku/${nomor}`),
    getCheckDataBKUDownload: (param: any): Promise<IResponse> => requests.post('/ApprovalBKU/getcheckdownloaddoc', param),

    approvalBKU: (param: any): Promise<IResponse> => requests.post('/ApprovalBKU/approvedokumenbku', param),
};

const ApprovalSPD = {
    getSPDKirimList: (id_ms_login: any): Promise<IResponse> => requests.get(`/ApprovalSPD/gettokirim/${id_ms_login}`),
    getSPDTerimaList: (id_ms_login: any): Promise<IResponse> => requests.get(`/ApprovalSPD/gettoterima/${id_ms_login}`),
    getSPDKirimNotTerimaList: (id_ms_login: any): Promise<IResponse> => requests.get(`/ApprovalSPD/getkirimantidakditerima/${id_ms_login}`),
    getDataOpsiTujuanESTList: (bagian: any): Promise<IResponse> => requests.get(`/ApprovalSPD/opsitujuanlist/${bagian}`),
    getDataOpsiTujuanJKTList: (bagian: any): Promise<IResponse> => requests.get(`/ApprovalSPD/opsitujuanlist/${bagian}`),
    getDirNotesList: (nomor: any): Promise<IResponse> => requests.get(`/ApprovalSPD/getrejectnotedir/${nomor}`),
    kirimSpd: (param: any): Promise<IResponse> => requests.post('/ApprovalSPD/kirimspd', param),
    terimaSpd: (param: any): Promise<IResponse> => requests.post('/ApprovalSPD/terimaspd', param),
    tolakSpd: (param: any): Promise<IResponse> => requests.post('/ApprovalSPD/tolakspd', param),

    getSPDDitolakList: (id_ms_login: any): Promise<IResponse> => requests.get(`/ApprovalSPD/getditolak/${id_ms_login}`),
    getDokFlowStatusList: (jenis: string, nomor: string): Promise<IResponse> => requests.get(`/ApprovalSPD/getdokflowstatusspd/${jenis}/${nomor}`),
    
    
    // kirimSpdHO: (param: any): Promise<IResponse> => requests.post('/ApprovalSPD/kirimspdfromho', param),
    // kirimSpdEST: (param: any): Promise<IResponse> => requests.post('/ApprovalSPD/kirimspdfromest', param),
    // saveCommentSpd: (param: any): Promise<IResponse> => requests.post('/ApprovalSPD/simpancomment', param),
    // updateDitujukan: (param: any): Promise<IResponse> => requests.post('/ApprovalSPD/updateditujukan', param),
    
};

const LaporanVoucher = {
    getVouBKU: (id_ms_login: number, tanggal: string, pt: string): Promise<IResponse> => requests.get(`/VoucherApproval/getlistvoubku/${id_ms_login}/${tanggal}/${pt}`),
    getVouApv: (id_ms_login: number): Promise<IResponse> => requests.get(`/VoucherApproval/getvouapv/${id_ms_login}`),
    getVouApvDtl: (id_ms_login: number, tanggal: string): Promise<IResponse> => requests.get(`/VoucherApproval/getvouapvdetail/${id_ms_login}/${tanggal}`),
    getVouLbr: (id_ms_login: number, tanggal: string, pt: string): Promise<IResponse> => requests.get(`/VoucherApproval/getvouapvlembar/${id_ms_login}/${tanggal}/${pt}`),
    getVouPT: (id_ms_login: number, tanggal: string): Promise<IResponse> => requests.get(`/VoucherApproval/getvoupt/${id_ms_login}/${tanggal}`),
    getOpsiPT: (id_ms_login: number, tanggal: string): Promise<IResponse> => requests.get(`/VoucherApproval/getopsipt/${id_ms_login}/${tanggal}`),
    createVouDtl: (param: any): Promise<IResponse> => requests.post('/VoucherApproval/createvoudtl', param),
    rilisVouApv: (param: any): Promise<IResponse> => requests.post('/VoucherApproval/rilisvouapv', param),
    isVouReady: (id_ms_login: number, tanggal: string): Promise<IResponse> => requests.get(`/VoucherApproval/isready/${id_ms_login}/${tanggal}`),
    getVouRole: (id_ms_login: number): Promise<IResponse> => requests.get(`/VoucherApproval/getvourole/${id_ms_login}`)
};

const ListHistorySPD = {
    // getListSPDHistory: (id_ms_login: number, pt: string, keyword: string, startdate: string, enddate: string)
    //     : Promise<IResponse> => requests.get(`/ApprovalSPD/getlistdokumen/${id_ms_login}/${pt}/${keyword}/${startdate}/${enddate}`),
    getListSPDHistory: (param:any)
        : Promise<IResponse> => requests.post(`/ApprovalSPD/getlistdokumen`, param),
    getListSPDHistoryDetail: (id: number)
        : Promise<IResponse> => requests.get(`/ApprovalSPD/getdokflowstatus/${id}`)
};


export default {
    ApprovalBKU,
    ApprovalSPD,
    LaporanVoucher, 
    ListHistorySPD
};
