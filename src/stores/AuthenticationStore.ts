import { RootStore } from './RootStore';
import { action, runInAction, observable } from 'mobx';
import agent from '../api/agent';
import { IMenu } from '../models/CommonModel';
import { IUserLogin } from '../models/AuthenticationModel';
import { encryptData } from '../utils/encrypt';

export default class AuthenticationStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable userModel: IUserLogin | null = null;
    @observable userMenuAkses: IMenu | null = null;

    @action login = async (values: any) => {
        try {
            const loginResponseData = await agent.Authentication.login(values);
            runInAction(() => {
                this.userModel = loginResponseData.result;
            });

            if (loginResponseData.statusCode === 200) {

                const LoginDataoriginalData = JSON.stringify(this.userModel?.loginData);
                const IdMsGrouporiginalData = JSON.stringify(this.userModel?.id_Ms_Group);
                const IdMsLoginoriginalData = JSON.stringify(this.userModel?.id_Ms_Login);
                const IdMsUnitUsahaoriginalData = JSON.stringify(this.userModel?.unitUsahaList);

                console.log("Login sukses, set data ke localStorage");

                //enkripsi data login
                const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
                const LoginDataEncryptedData = encryptData(LoginDataoriginalData, salt);
                const IdMsgroupEncryptedData = encryptData(IdMsGrouporiginalData, salt);
                const IdMsloginEncryptedData = encryptData(IdMsLoginoriginalData, salt);
                const IdMsUnitUsahaEncryptedData = encryptData(IdMsUnitUsahaoriginalData, salt);

                localStorage.setItem('ld', LoginDataEncryptedData);
                localStorage.setItem('grplist', IdMsgroupEncryptedData);
                localStorage.setItem('uulist', IdMsUnitUsahaEncryptedData);
                localStorage.setItem('lgid', IdMsloginEncryptedData);
                // this.rootStore.commonStore.setIDMsLogin(loginResponseData.result.loginData[0].id_ms_login);

                //token jwt
                this.rootStore.commonStore.setToken(loginResponseData.result.token);
            }

            return loginResponseData

        } catch (error) {
            throw error;
        }
    };

    @action getMenu = async (id_ms_group: any) => {
        try {
            let menuListResponse = await agent.Authentication.menu(id_ms_group);
            runInAction(() => {
                this.userMenuAkses = menuListResponse.result;
            });

            if (menuListResponse.statusCode === 200) {
                for (let i = 0; i < menuListResponse.result.length; i++) {
                    const element = menuListResponse.result[i];
                    const originalData = JSON.stringify(element);

                    //Enkripsi data menu
                    const salt = '8652dabf-cba7-4bd3-ac4e-9c1a43be9673';
                    const encryptedData = encryptData(originalData, salt);
                    localStorage.setItem(element.modulname.toLowerCase(), encryptedData);
                    

                    //Non-Enkripsi (original Data menu)
                    // localStorage.setItem(element.modulname, originalData);
                }
            }

            return menuListResponse;
        } catch (error) {
            throw error;
        }
    };

    @action getListDataMenu = async (param: any) => {

        try {
            const response = await agent.GeneralList.listCount(param);
            return response;
        } catch (error) {
            throw error;
        }
    };


    @action changepassword = async (param: any) => {

        try {
            const response = await agent.Authentication.changepassword(param);
            return response;
        } catch (error) {
            throw error;
        }

    };

    @action logout = async () => {
        window.localStorage.clear();
    };
}
