
import { action, runInAction, observable } from "mobx";
import agent from "../api/agent";
import { AccountingRootStore } from "./AccountingRootStore";

export default class BKUAccountingStore {
    accountingRootStore: AccountingRootStore;

    constructor(accountingRootStore: AccountingRootStore) {
        this.accountingRootStore = accountingRootStore;
    }

    @action getDataBKU = async (id_ms_login: any) => {
        try {
            const response = await agent.BKUAccounting.getBKUList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataBKUDetail = async (param: any) => {
        try {
            const response = await agent.BKUAccounting.getBKUDetail(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getAkunList = async () => {
        try {
            const response = await agent.Akun.getAkunList();
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action updateAkun = async (param: any) => {
        try {
            const response = await agent.Akun.updateAkun(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action approvalBKU = async (param: any) => {
        try {
            const response = await agent.BKUAccounting.bkuAccountingApproval(param);
            return response;
        } catch (error) {
            throw error;
        }
    }


}
