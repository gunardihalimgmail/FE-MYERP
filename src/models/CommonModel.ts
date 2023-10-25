export interface IResponse{
    statusCode: number;
    message: string;
    result:any;
}

export interface IMenu{
    modulname: string;
    modulpath: string;
    modularrow: string;
    modulicon: string;
    forms: IForm[];
}

export interface IForm{
    namamodul: string;
    formname: string;
    formpath: string; 
    formflag: string;
    aksescreate: string;
    aksesread: string;
    aksesupdate: string;
    aksesdelete: string;
    aksesinternal: string;
    aksesexternal: string;
}

export interface IListDataCount{
    iD_Ms_Login: number;
    namaForm: string;
    storedProcedure: string;
    path: string;
}

export interface ICountedData{
    id_ms_login: number;
    listCount: number;
    namaForm: string;
    path: string;
    divisi: string;
    userkaryawan: string;
}

export interface IUnitUsaha {
    value: string;
    label: string;
}