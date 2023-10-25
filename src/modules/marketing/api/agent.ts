import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../../models/CommonModel";
import history from "../../../utils/history";

const marketingAxios = axios.create(
    {
        // baseURL: 'http://192.168.11.44:9006/api',
        //baseURL: 'https://localhost:6005/api/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
);

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => marketingAxios.get(url).then(responseBody),
    post: (url: string, body: {}) => marketingAxios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => marketingAxios.put(url, body).then(responseBody),
    del: (url: string) => marketingAxios.delete(url).then(responseBody),
};

const ApprovalPenjualanUnit = {
    // ID = ID Login
    approvalPenjualanUnitList: (id: number): Promise<IResponse> =>
        requests.get(`/approvalpenjualan/listapprovalpenjualanunit/${id}`),
    // ID = ID Pengajuan Penjualan
    approvalPenjualanUnitDetail: (id: number): Promise<IResponse> =>
        requests.get(`/approvalpenjualan/approvalpenjualanunitdetail/${id}`),
    // ID = ID Pengajuan Penjualan, Flag = Flag Dokumen
    approvalPenjualanUnitDetailDocument: (id: number, flag: string): Promise<IResponse> =>
        requests.get(`/approvalpenjualan/approvalpenjualanunitdetaildocument/${id}/${flag}`),
    approvalPenjualanUnitApproveOrReject: (param: any): Promise<IResponse> =>
        requests.put('/approvalpenjualan/approvalpenjualanunitapproveorreject', param),
    approvalPenjualanUnitListCount: (param: any): Promise<IResponse> =>
        requests.post('/approvalpenjualan/listapprovalpenjualanunitCount', param),
};

// const GeneralList = {
//     moduleList: (): Promise<IResponse> => requests.get("/module/list"),
// };

// const Authentication = {
//     login: (login: any): Promise<IResponse> =>
//         requests.post("/authentication/login", login),
//     logout: (logout: any): Promise<IResponse> =>
//         requests.post("/authentication/logout", logout),
// };

// export { marketingAxios };

export default {
    ApprovalPenjualanUnit,
    // GeneralList,
    // Authentication,
};
