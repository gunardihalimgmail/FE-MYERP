import { IForm } from '../models/CommonModel';
import { decryptData } from './encrypt';

export const getIdLogin = () => {
    const loginDataEncrypted = localStorage.ld;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedDataLogin = decryptData(loginDataEncrypted, salt_login);
    const JSONLoginData = JSON.parse(decryptedDataLogin);

    return JSONLoginData[0].id_ms_login;
}

export const getIdLoginReplacement = () => {
    const loginDataReplEncrypted = localStorage.lgid;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedDataLoginRepl = decryptData(loginDataReplEncrypted, salt_login);
    const JSONLoginDataRepl = JSON.parse(decryptedDataLoginRepl);

    return JSONLoginDataRepl;
}

export const getIdGroup = () => {
    const idMsGroupEncrypted = localStorage.grplist;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedIdMsGroup = decryptData(idMsGroupEncrypted, salt_login);
    const JSONIdMsGroup = JSON.parse(decryptedIdMsGroup);

    return JSONIdMsGroup;
}

export const getUnitUsahaSelectList = () => {
    const idUnitUsahaEncrypted = localStorage.uulist;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedIdMsUnitUsaha = decryptData(idUnitUsahaEncrypted, salt_login);
    const JSONIdMsUnitUsaha = JSON.parse(decryptedIdMsUnitUsaha);

    return JSONIdMsUnitUsaha;
}

export const getIdUnitUsaha = () => {
    const loginDataEncrypted = localStorage.ld;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedDataLogin = decryptData(loginDataEncrypted, salt_login);
    const JSONLoginData = JSON.parse(decryptedDataLogin);
    return JSONLoginData[0].id_ms_unitusaha;
}

export const getUserAccess = (modulname: string, formName: string) => {
    const dataForms: IForm[] = [];
    const menuEncrypted = localStorage[modulname];
    const salt_menu = '8652dabf-cba7-4bd3-ac4e-9c1a43be9673';
    const decryptedDataMenu = decryptData(menuEncrypted, salt_menu);
    const JSONMenu = JSON.parse(decryptedDataMenu);

    const filteredMenu = JSONMenu.forms.filter((x: { formname: string; }) => x.formname === formName);
    dataForms.push(filteredMenu);

    return dataForms;
}

export const getKaryawanLogin = () => {

    const loginDataEncrypted = localStorage.ld;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedDataLogin = decryptData(loginDataEncrypted, salt_login);
    const JSONLoginData = JSON.parse(decryptedDataLogin);
    return JSONLoginData[0].namakaryawan;
}

export const getGroupName = () => {

    const loginDataEncrypted = localStorage.ld;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedDataLogin = decryptData(loginDataEncrypted, salt_login);
    const JSONLoginData = JSON.parse(decryptedDataLogin);
    return JSONLoginData[0].namagroup;
}

export const getBagianName = () => {

    const loginDataEncrypted = localStorage.ld;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedDataLogin = decryptData(loginDataEncrypted, salt_login);
    const JSONLoginData = JSON.parse(decryptedDataLogin);
    return JSONLoginData[0].bagian;
}

export const getIdDivisi = () => {

    const loginDataEncrypted = localStorage.ld;
    const salt_login = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const decryptedDataLogin = decryptData(loginDataEncrypted, salt_login);
    const JSONLoginData = JSON.parse(decryptedDataLogin);
    return JSONLoginData[0].id_ms_divisi;
}