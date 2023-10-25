
import { action, runInAction, observable } from "mobx";
import agent from "../api/agent";
import { FinanceRootStore } from "./FinanceRootStore";

export default class ApprovalBKUStore {
    financeRootStore: FinanceRootStore;

    constructor(financeRootStore: FinanceRootStore) {
        this.financeRootStore = financeRootStore;
    }

    @action getDataBKU = async (id_ms_login: any) => {
        try {
            const response = await agent.ApprovalBKU.getBKUList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataBKUDetail = async (nomor: any) => {
        try {
            const response = await agent.ApprovalBKU.getBKUDetailOpLpb(String(nomor));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getCheckDataBKUDownloaded = async (param: any) => {
        try {
            const response = await agent.ApprovalBKU.getCheckDataBKUDownload(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action approveBKU = async (param: any) => {
        try {
            const response = await agent.ApprovalBKU.approvalBKU(param);
            return response;
        } catch (error) {
            throw error;
        }
    }


}
