import { IUnitUsaha } from "./CommonModel";

export interface ILoginFormValues{
    username: string;
    password: string;
}

export interface IUserLogin{
    loginData: ILoginproperty[];
    loginDataReplacement: ILoginReplacementproperty[];
    id_Ms_Group : Number[];
    id_Ms_Login : Number[];
    unitUsahaList : IUnitUsaha[];
    token: string;
}

export interface ILoginproperty{
    id_ms_login: string;
    id_ms_group: string;
    namagroup: string;
    namakaryawan: string;
}

export interface ILoginReplacementproperty{
    idpemilik: string;
    id_ms_group: string;
    startdate: string;
    enddate: string;
}